import GnosisSafeSol from "@gnosis.pm/safe-contracts/build/artifacts/contracts/GnosisSafe.sol/GnosisSafe.json"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { TokenAmount } from "@uniswap/sdk"
import { BigNumber, ethers } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import { createSafeSdk } from "utils/createSafeSdk"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const CALL = 0

/*  decimal integer  */
export const amount = (amount, decimals) => Math.round(amount * 10 ** (decimals || 18)).toString()

/* Human Readable Token Balance  */
export const readableTokenBalance = token => {
  if(parseInt(token?.fiatBalance) === 0)
    return 0

  return Number((token?.balance / 10 ** token?.token?.decimals).toString().match(/^\d+(?:\.\d{0,3})?/))
}

/*
 *
 *  Encode smart contract function and parameter data
 *
 * */
export const contractInterface = contract => {
  const fragments = contract.instance.interface.functions
  let abi = new ethers.utils.Interface(contract.abi)
  const data = abi.encodeFunctionData(fragments[contract.fn], Object.values(contract.args))

  return { data }
}

/*
 *
 * Compose Gnosis Safe Transaction Object,
 * Propose, Sign and Execute it.
 *
 * */
export const executeTransaction = async ({
  baseGas,
  data,
  gasPrice,
  gasToken,
  nonce,
  operation,
  origin,
  refundReceiver,
  safeInstance,
  safeTxGas,
  safeService,
  sender,
  to,
  valueInWei,
}) => {
  /*
   * Construct Gnosis Safe Transaction (SafeTx) Object
   * "SafeTx(address to,
   *   uint256 value,
   *   bytes data,
   *   uint8 operation,
   *   uint256 safeTxGas,
   *   uint256 baseGas,
   *   uint256 gasPrice,
   *   address gasToken,
   *   address refundReceiver,
   *   uint256 nonce
   * )"
   *
   * https://github.com/safe-global/safe-contracts/blob/main/contracts/GnosisSafe.sol
   *
   * */
  const safeTx = {
    to: ethers.utils.getAddress(to),
    value: amount(parseFloat(ethers.utils.formatEther(valueInWei))),
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce
  }

  /*
   *
   * Propose, Sign and Execute SafeTx
   *
   *  */

  const safeSdk = await createSafeSdk(safeInstance.address)
  const safeTransaction = await safeSdk.createTransaction(safeTx)
  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
  await safeService.proposeTransaction({
    safeAddress: ethers.utils.getAddress(safeInstance.address),
    safeTransaction,
    safeTxHash,
    senderAddress: sender,
    origin,
  })
  const transaction = await safeService.getTransaction(safeTxHash)
  const hash = transaction?.safeTxHash
  const sig = await safeSdk.signTransactionHash(hash)
  await safeService.confirmTransaction(hash, sig?.data)
  const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
  return executeTxResponse?.transactionResponse && (await executeTxResponse.transactionResponse.wait())
}

export const handleGnosisTransaction = async ({ contract, signer, safeAddress, to, value }) => {
  const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")

  if (!!signer) {
    /*  Initialize bbyDao Gnosis Safe Instance */
    const bbyDaoSafe = new ethers.Contract(safeAddress, GnosisSafeSol.abi, signer)

    /* last transaction made by bbyDAO */
    // const nonce = await safeService.getNextNonce(safeAddress)
    const nonce = 11

    /* Encode Data */
    const { data } = contractInterface(contract)

    /*  construct gnosis transaction object  */
    const safeTx = {
      safeService,
      safeInstance: bbyDaoSafe,
      to: to,
      valueInWei: value,
      data: data,
      operation: CALL,
      nonce: nonce,
      safeTxGas: 0,
      baseGas: 0,
      gasPrice: 0,
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: signer._address,
    }

    if (!!safeTx.data) {
      const threshold = await bbyDaoSafe?.getThreshold()
      if (threshold.toNumber() > 1) {
        /*  Reject or ask for approvals */
      } else {
        try {
          const tx = await executeTransaction(safeTx)
          console.log("tx", tx)
        } catch (err) {
          console.error(`Error while creating transaction: ${err}`)
          throw err
        }
      }
    }
  }
}

/*  Get Total Pair supply from Uniswap Contract */
const totalPairSupply = async (pair, abi) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(pair.liquidityToken.address, abi, provider)
  return contract.totalSupply()
}

/* Handle interaction with Uniswap to get LP information  */
export const getLiquidityPairInfo = async ({
  pair,
  token0,
  token0Input,
  token0ETHConversion,
  token1,
  token1Input,
  token1ETHConversion,
  abi,
}) => {
  if (!!pair) {
    /* Get Total Supply of LP pair on-chain  */
    const total = await totalPairSupply(pair, abi)
    const totalTokenAmount = await new TokenAmount(pair.liquidityToken, total)
    const token0Amount = await new TokenAmount(token0, amount(token0Input, token0?.decimals))
    const token0AmountInEth = (token0Input * token0ETHConversion).toFixed(token0?.decimals).toString()
    const token1Amount = await new TokenAmount(token1, amount(token1Input, token1?.decimals))
    const token1AmountInEth = (token1Input * token1ETHConversion).toFixed(token1?.decimals).toString()
    const uniswapTokensMinted = pair
      ?.getLiquidityMinted(totalTokenAmount, token0Amount, token1Amount)
      .toFixed(pair.liquidityToken.decimals)
    const percentageOfPool = uniswapTokensMinted / totalTokenAmount.toFixed(pair.liquidityToken.decimals)
    const uniswapPairURI = `https://v2.info.uniswap.org/pair/${pair.liquidityToken.address}`
    const etherscanURI = `https://etherscan.io/address/${pair.liquidityToken.address}`
    const transactionInfo = [
      {
        token: token0,
        amount: Number(token0Input),
        amountInWei: ethers.utils.parseEther(token0AmountInEth),
      },
      {
        token: token1,
        amount: Number(token1Input),
        amountInWei: ethers.utils.parseEther(token1AmountInEth),
      },
    ]

    return {
      percentageOfPool,
      total: formatUnits(BigNumber.from(total._hex)),
      transactionInfo,
      uniswapTokensMinted,
      uris: {
        uniswap: uniswapPairURI,
        etherscan: etherscanURI,
      },
    }
  }
}

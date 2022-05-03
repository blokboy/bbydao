import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { ChainId, TokenAmount } from "@uniswap/sdk"
import GnosisSafeSol from "@gnosis.pm/safe-contracts/build/artifacts/contracts/GnosisSafe.sol/GnosisSafe.json"
import axios from "axios"
import { BigNumber, ethers } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import { isEmpty } from "utils/helpers"
import { createSafeSdk } from "../../../utils/createSafeSdk"

export const EIP712_SAFE_TX_TYPE = {
  SafeTx: [
    { type: "address", name: "to" },
    { type: "uint256", name: "value" },
    { type: "bytes", name: "data" },
    { type: "uint8", name: "operation" },
    { type: "uint256", name: "safeTxGas" },
    { type: "uint256", name: "baseGas" },
    { type: "uint256", name: "gasPrice" },
    { type: "address", name: "gasToken" },
    { type: "address", name: "refundReceiver" },
    { type: "uint256", name: "nonce" },
  ],
}

export const hexToBytes = hexString => {
  if (hexString.length % 2 !== 0) {
    throw "Must have an even number of hex digits to convert to bytes"
  }
  let numBytes = hexString.length / 2
  let byteArray = new Uint8Array(numBytes)
  for (let i = 0; i < numBytes; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16)
  }
  return byteArray
}

const generateTypedDataFrom = async ({
  baseGas,
  data,
  gasPrice,
  gasToken,
  nonce,
  operation,
  refundReceiver,
  safeTxGas,
  to,
  valueInWei,
}) => {
  const bytes = hexToBytes(data)
  const value = parseInt(amount(ethers.utils.formatEther(valueInWei)))

  return {
    to: ethers.utils.getAddress(to),
    value: valueInWei,
    data: bytes,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken: ethers.utils.getAddress(gasToken),
    refundReceiver: ethers.utils.getAddress(refundReceiver),
    nonce: nonce,
  }
}

export const getEIP712Signature = async (safeTx, safeAddress, signer) => {
  const chainId = signer.provider._network.chainId || ChainId.MAINNET
  const typedData = await generateTypedDataFrom(safeTx)
  const domain = {
    chainId,
    verifyingContract: safeAddress,
  }
  const signature = await signer?._signTypedData(domain, EIP712_SAFE_TX_TYPE, typedData)
  const recoveredAddress = ethers.utils.verifyTypedData(domain, EIP712_SAFE_TX_TYPE, typedData, signature)

  /*  this confirms our signature is correct  */
  console.log("recoveredAddress", recoveredAddress)
  console.log("address", signer._address)

  return signature
}

const calculateBodyFrom = async (
  safeInstance,
  to,
  valueInWei,
  data,
  operation,
  nonce,
  safeTxGas,
  baseGas,
  gasPrice,
  gasToken,
  refundReceiver,
  transactionHash,
  sender,
  origin,
  signature
) => {
  const contractTransactionHash = await safeInstance.getTransactionHash(
    to,
    BigNumber.from(amount(parseFloat(ethers.utils.formatEther(valueInWei)))), // tho it seems a hexString is bigNumberish this fn seems to want a BN
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce
  )

  return {
    safe: ethers.utils.getAddress(safeInstance.address),
    to: ethers.utils.getAddress(to),
    value: amount(parseFloat(ethers.utils.formatEther(valueInWei))),
    data,
    operation,
    gasToken,
    safeTxGas,
    baseGas,
    gasPrice,
    refundReceiver,
    nonce,
    contractTransactionHash,
    sender: ethers.utils.getAddress(sender),
    // signature,
    origin,
  }
}

const getTxServiceUrl = () => "safe-transaction.gnosis.io/api/v1"
const getSafeServiceBaseUrl = safeAddress => `https://${getTxServiceUrl()}/safes/${safeAddress}`
const safeTransactionV1MultisigTransaction = safeAddress => {
  const address = ethers.utils.getAddress(safeAddress)
  return `${getSafeServiceBaseUrl(address)}/multisig-transactions/?has_confirmations=True`
}

const safeTransactionV2GasEstimate = safeAddress => {
  const address = ethers.utils.getAddress(safeAddress)
  return `https://safe-relay.gnosis.io/api/v1/safes/${address}/transactions/estimate/`
}

export const proposeAnExecuteTransaction = async ({
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
  signature,
  to,
  txHash,
  valueInWei,
}) => {
  const url = safeTransactionV1MultisigTransaction(safeInstance.address)
  const body = await calculateBodyFrom(
    safeInstance,
    to,
    valueInWei,
    data,
    operation,
    nonce,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    txHash || null,
    sender,
    origin || null,
    signature
  )

  console.log("body", body)

  // const gasEstimateUrl = await safeTransactionV2GasEstimate(safeInstance.address)
  // const gasEstimate = await axios.post(gasEstimateUrl, {safe: safeInstance.address, to, value: parseFloat(amount(ethers.utils.formatEther(valueInWei))), data, operation, gasToken})
  // console.log('gas', gasEstimate)

  // /*  Use SDK instead of manually constructing all of this  */
  const safeSdk = await createSafeSdk(safeInstance.address)
  const safeTransaction = await safeSdk.createTransaction(body)
  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
  await safeService.proposeTransaction({
    safeAddress: safeInstance.address,
    safeTransaction,
    safeTxHash,
    senderAddress: sender,
    origin,
  })
  const pendingTxs = await safeService.getPendingTransactions(safeInstance.address)
  const transaction = await safeService.getTransaction(safeTxHash)

  const hash = transaction?.safeTxHash
  let sig = await safeSdk.signTransactionHash(hash)
  await safeService.confirmTransaction(hash, sig.data)
  // const owner1Signature = await safeSdk.signTransaction(safeTransaction)

  const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
  const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
  console.log("e", safeTransaction)
  // console.log('o', owner1Signature)
  console.log("ex", executeTxResponse)
  console.log("receip", receipt)

  // const response = await axios.post(url, body)
  // // const response = {status: 202}
  // //
  // if (response.status !== 201) {
  //   return {}
  // }
  //
  // if (response.status === 201) {
  //   return {
  //     to: body.to,
  //     valueInWei: body.value,
  //     data: body.data,
  //     operation: body.operation,
  //     safeTxGas: body.safeTxGas,
  //     baseGas: body.baseGas,
  //     gasPrice: body.gasPrice,
  //     gasToken: body.gasToken,
  //     refundReceiver: body.refundReceiver,
  //     signature: body.signature,
  //   }
  // }
}

const EMPTY_DATA = "0x"
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const SIGNATURE_TYPE = "01"
const CALL = 0
export const getPreValidatedSignature = (from, initialString = EMPTY_DATA) => {
  return `${initialString}000000000000000000000000${from.replace(
    EMPTY_DATA,
    ""
  )}0000000000000000000000000000000000000000000000000000000000000000${SIGNATURE_TYPE}`
}
// https://docs.gnosis-safe.io/contracts/signatures

/*



 */
export const contractInterface = contract => {
  /* Encode uniswap addLiquidity function with input contract.arguments  */
  const fragments = contract.instance.interface.functions
  let abi = new ethers.utils.Interface(contract.abi)
  const data = abi.encodeFunctionData(fragments[contract.fn], Object.values(contract.args))

  console.log("args", contract.args, Object.values(contract.args))

  return { data }
}

export const handleGnosisTransaction = async ({ executingContract, signer, safeAddress, to, value }) => {
  const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")

  if (!!signer) {
    /*  Initialize bbyDao Gnosis Safe Instance */
    const bbyDaoSafe = new ethers.Contract(safeAddress, GnosisSafeSol.abi, signer)

    /* last transaction made by bbyDAO */
    const nonce = await safeService.getNextNonce(safeAddress)
    // const nonce = 3

    /* Pre-validated Gnosis signature */
    const signature = getPreValidatedSignature(signer._address)

    /* Encode Data */
    const { data } = contractInterface(executingContract)

    // const safeTxGas = await bbyDaoSafe?.requiredTxGas(ethers.utils.getAddress(to),amount(parseFloat(ethers.utils.formatEther(value))), hexToBytes(data), CALL)
    // console.log('safe', safeTxGas)

    /*  construct gnosis transaction object  */
    const safeTx = {
      safeService,
      safeInstance: bbyDaoSafe,
      to: to,
      valueInWei: value,
      // valueInWei: 0,
      data: data,
      operation: CALL,
      nonce: nonce,
      // safeTxGas: 0,
      baseGas: 0,
      // gasPrice: 0,
      gasToken: ZERO_ADDRESS,
      refundReceiver: ZERO_ADDRESS,
      sender: signer._address,
      signature,
      //temp
      gasPrice: 30,
      safeTxGas: 200000,
    }

    if (!!safeTx.data) {
      const threshold = await bbyDaoSafe?.getThreshold()
      if (threshold.toNumber() > 1) {
        /*  Reject or ask for approvals */
      } else {
        try {
          const tx = await proposeAnExecuteTransaction({ ...safeTx, signature })

          // const signature = await getEIP712Signature(safeTx, safeAddress, signer, bbyDaoSafe)
          // if (signature) {
          //   const tx = await saveTxToHistory({ ...safeTx, signature })
          //
          // }
        } catch (err) {
          console.error(`Error while creating transaction: ${err}`)
          throw err
        }
      }
    }
  }
}

export const amount = (amount, decimals) => Math.round(amount * 10 ** (decimals || 18)).toString()

/* Human Readable Token Balance  */
export const readableTokenBalance = token => {
  return Number((token?.balance / 10 ** token?.token?.decimals).toString().match(/^\d+(?:\.\d{0,3})?/))
}

const totalPairSupply = async (pair, abi) => {
  /* create a generic provider and query for unsold market items */
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

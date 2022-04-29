import SafeServiceClient        from "@gnosis.pm/safe-service-client"
import { ChainId, TokenAmount } from "@uniswap/sdk"
import GnosisSafeSol            from "ABIs/gnosisSafe.json"
import axios                    from "axios"
import CPK, { EthersAdapter }   from "contract-proxy-kit"
import { toChecksumAddress }    from "ethereumjs-util"
import { BigNumber, ethers }    from "ethers"
import { formatUnits }          from "ethers/lib/utils"
import {isEmpty}                from '../../../utils/helpers'

const EIP712_SAFE_TX_TYPE = {
  // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
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
  return {
    to,
    value: valueInWei,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce: Number(nonce),
  }
}

export const getEIP712Signature = async (safeTx, safeAddress, signer) => {
  const chainId = signer.provider._network.chainId || ChainId.MAINNET
  const typedData = await generateTypedDataFrom(safeTx)
  const domain = {
    verifyingContract: safeAddress,
    chainId
  }
  return await signer._signTypedData(domain, EIP712_SAFE_TX_TYPE, typedData)
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
    valueInWei,
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
    safe: toChecksumAddress(safeInstance.address),
    to: toChecksumAddress(to),
    value: parseInt(valueInWei),
    data,
    operation,
    gasToken,
    safeTxGas,
    baseGas,
    gasPrice,
    refundReceiver,
    nonce,
    contractTransactionHash,
    sender: toChecksumAddress(sender),
    signature,
    origin,
  }
}

const getTxServiceUrl = () => "safe-transaction.gnosis.io/api/v1"
const getSafeServiceBaseUrl = safeAddress => `https://${getTxServiceUrl()}/safes/${safeAddress}`
const buildTxServiceUrl = safeAddress => {
  const address = toChecksumAddress(safeAddress)
  return `${getSafeServiceBaseUrl(address)}/multisig-transactions/?has_confirmations=True`
}

export const saveTxToHistory = async ({
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
  sender,
  signature,
  to,
  txHash,
  valueInWei,
}) => {
  const url = buildTxServiceUrl(safeInstance.address)
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

  const response = await axios.post(url, body)

  if (response.status !== 201) {
    return {}
  }

  if (response.status === 201) {
    console.log('body', body)
    return {
      to: body.to,
      valueInWei: body.value,
      data: body.data,
      operation: body.operation,
      safeTxGas: body.safeTxGas,
      baseGas: body.baseGas,
      gasPrice: body.gasPrice,
      gasToken: body.gasToken,
      refundReceiver: body.refundReceiver,
      signature: body.signature
    }
  }
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

export const constructDataFromContract = contract => {
  /* Encode uniswap addLiquidity function with input contract.arguments  */
  const fragments = contract.instance.interface.functions
  let abi = new ethers.utils.Interface(contract.abi)
  const data = abi.encodeFunctionData(fragments[contract.fn], Object.values(contract.args))

  return { data }
}

export const handleGnosisTransaction = async ({ executingContract, signer, safeAddress, to, value }) => {
  const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")

  if (!!signer) {
    /*  Initialize bbyDao Gnosis Safe Instance */
    const bbyDaoSafe = new ethers.Contract(safeAddress, GnosisSafeSol.abi, signer)

    /* last transaction made by bbyDAO */
    const nonce = await safeService.getNextNonce(safeAddress)

    /* Pre-validated Gnosis signature */
    const signature = getPreValidatedSignature(signer._address)

    /* Encode Data */
    const { data } = constructDataFromContract(executingContract)

    /*  construct gnosis transaction object  */
    const safeTx = {
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
      sigs: signature,
    }

    if (!!safeTx.data && !!safeTx.valueInWei) {
      const threshold = await bbyDaoSafe?.getThreshold()
      if (threshold.toNumber() > 1) {
        /*  Reject or ask for approvals */
      } else {
        try {
          const signature = await getEIP712Signature(safeTx, safeAddress, signer)
          if (signature) {
            const tx = await saveTxToHistory({ ...safeTx, signature })
            console.log('TX', tx)
            if (!isEmpty(tx)) {
              console.log("tx", tx)
              const execute = await bbyDaoSafe?.execTransaction(
                tx.to,
                tx.valueInWei,
                tx.data,
                tx.operation,
                tx.safeTxGas,
                tx.baseGas,
                tx.gasPrice,
                tx.gasToken,
                tx.refundReceiver,
                tx.signature
              )

              console.log('exe', execute)
            }
          }
        } catch (err) {
          console.error(`Error while creating transaction: ${err}`)
          throw err
        }
      }
    }
  }
}

export const amount = (amount, decimals) => Math.round(amount * 10 ** decimals).toString()

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

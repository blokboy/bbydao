import SafeServiceClient     from '@gnosis.pm/safe-service-client'
import { ChainId }           from "@uniswap/sdk"
import axios                 from "axios"
import CPK, {EthersAdapter}  from 'contract-proxy-kit'
import { toChecksumAddress } from "ethereumjs-util"

import {ethers, utils} from "ethers"
import GnosisSafeSol   from '../../../ABIs/gnosisSafe.json'

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
const chainId = ChainId.MAINNET
export const calculateSafeTxHash = (safeAddress, safeTx) =>
  utils._TypedDataEncoder.hash({ verifyingContract: safeAddress, chainId }, EIP712_SAFE_TX_TYPE, safeTx)

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
    message: {
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
    },
  }
}

export const getEIP712Signature = async (safeTx, safeAddress, signer) => {
  let signature
  const chainId = signer.provider._network.chainId || ChainId.MAINNET
  const typedData = await generateTypedDataFrom(safeTx)
  const domain = {
    verifyingContract: safeAddress,
    chainId,
  }
  const message = typedData.message

  signature = await signer._signTypedData(domain, EIP712_SAFE_TX_TYPE, message)

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
    return Promise.reject(new Error("Error submitting the transaction"))
  }

  if (response.status === 201) {
    console.log("safeInstance", safeInstance)
    // const execute = safeInstance.executeTransaction({
    //   to: body.to,
    //   value: body.value,
    //   data: body.data,
    //   operation: body.operation,
    //   safeTxGas: body.safeTxGas,
    //   baseGas: body.baseGas,
    //   gasPrice: body.gasPrice,
    //   gasToken: body.gasToken,
    //   refundReceiver: body.refundReceiver,
    //   signature,
    // })
    return {
      safeTx: [
        {
          to: body.to,
          value: body.value,
          data: body.data,
          operation: body.operation,
        },
      ],
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

export const constructDataFromContract = (contract) => {
  /* Encode uniswap addLiquidity function with input contract.arguments  */
  const fragments = contract.instance.interface.functions
  let abi = new ethers.utils.Interface(contract.abi)
  const data = abi.encodeFunctionData(
      fragments["addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)"],
      [
        contract.arguments.tokenA,
        contract.arguments.tokenB,
        contract.arguments.amountADesired,
        contract.arguments.amountBDesired,
        contract.arguments.amountAMin,
        contract.arguments.amountBMin,
        contract.arguments.addressTo,
        contract.arguments.deadline,
      ]
  )

  return {data}
}

export const createGnosisTransaction = async ({ executingContract, signer, safeAddress, to, value }) => {
  const safeService = new SafeServiceClient("https://safe-transaction.gnosis.io")

  if (!!signer) {
    /*  Initialize Gnosis CPK - set in state */
    const ethLibAdapter = new EthersAdapter({ ethers, signer })
    const cpk = await CPK.create({ ethLibAdapter })

    /*  Initialize bbyDao Gnosis Safe Instance */
    const bbyDaoSafe = new ethers.Contract(safeAddress, GnosisSafeSol.abi, signer)

    /* last transaction made by bbyDAO */
    const nonce = await safeService.getNextNonce(safeAddress)

    /* Pre-validated Gnosis signature */
    const signature = getPreValidatedSignature(signer._address)

    /* Encode Data */
    const {data} = constructDataFromContract(executingContract)

    /*  construct gnosis transaction object  */
    let txHash
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

    /*  generate transaction hash  */
    // const safeTxHash = calculateSafeTxHash(safeAddress, { ...safeTx, value: safeTx.valueInWei })

    if (!!safeTx.data && !!safeTx.valueInWei) {
      const threshold = await bbyDaoSafe?.getThreshold()
      if (threshold.toNumber() > 1) {
        /*  Reject or ask for approvals */
      } else {
        try {
          const signature = await getEIP712Signature(safeTx, safeAddress, signer)
          if (signature) {
            const tx = await saveTxToHistory({ ...safeTx, signature })
            if (Array.isArray(tx.safeTx) && tx?.safeTx?.length === 1) {
              const execute = await cpk.execTransactions(tx.safeTx)
              console.log("created", execute)
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


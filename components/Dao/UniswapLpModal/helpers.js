import {TypedDataUtils}    from '@metamask/eth-sig-util'
import {ChainId}           from '@uniswap/sdk'
import axios               from 'axios'
import {toChecksumAddress} from 'ethereumjs-util'

export const generateSafeTxHash = (safeAddress, txArgs) => {
    const primaryType = 'SafeTx'
    const messageTypes = {
        EIP712Domain: [{type: 'address', name: 'verifyingContract'}],
        SafeTx: [
            {type: 'address', name: 'to'},
            {type: 'uint256', name: 'value'},
            {type: 'bytes', name: 'data'},
            {type: 'uint8', name: 'operation'},
            {type: 'uint256', name: 'safeTxGas'},
            {type: 'uint256', name: 'baseGas'},
            {type: 'uint256', name: 'gasPrice'},
            {type: 'address', name: 'gasToken'},
            {type: 'address', name: 'refundReceiver'},
            {type: 'uint256', name: 'nonce'},
        ],
    }


    const typedData = {
        types: messageTypes,
        domain: {
            verifyingContract: safeAddress,
        },
        primaryType,
        message: {
            to: txArgs.to,
            value: txArgs.valueInWei,
            data: txArgs.data,
            operation: txArgs.operation,
            safeTxGas: txArgs.safeTxGas,
            baseGas: txArgs.baseGas,
            gasPrice: txArgs.gasPrice,
            gasToken: txArgs.gasToken,
            refundReceiver: txArgs.refundReceiver,
            nonce: txArgs.nonce,
        },
    }

    return `0x${TypedDataUtils.eip712Hash(typedData, "V4").toString('hex')}`
}

const generateTypedDataFrom = async ({
                                         baseGas,
                                         data,
                                         gasPrice,
                                         gasToken,
                                         nonce,
                                         operation,
                                         refundReceiver,
                                         safeAddress,
                                         safeTxGas,
                                         to,
                                         valueInWei,
                                     }) => {
    return {
        types: {
            EIP712Domain: [
                {
                    type: 'address',
                    name: 'verifyingContract',
                },
            ],
            SafeTx: [
                {type: 'address', name: 'to'},
                {type: 'uint256', name: 'value'},
                {type: 'bytes', name: 'data'},
                {type: 'uint8', name: 'operation'},
                {type: 'uint256', name: 'safeTxGas'},
                {type: 'uint256', name: 'baseGas'},
                {type: 'uint256', name: 'gasPrice'},
                {type: 'address', name: 'gasToken'},
                {type: 'address', name: 'refundReceiver'},
                {type: 'uint256', name: 'nonce'},
            ],
        },
        domain: {
            verifyingContract: safeAddress,
        },
        primaryType: 'SafeTx',
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


export const tryOffchainSigning = async (safeTxHash, txArgs, signer) => {
    let signature
    const chainId = ChainId.MAINNET
    const typedData = await generateTypedDataFrom(txArgs)
    const domain = {
        name: 'bbyDao',
        version: '0.0.1',
        chainId,
        verifyingContract: txArgs.safeAddress,
    };
    const types = {SafeTx: typedData.types.SafeTx}
    const message = typedData.message

    // let gasLimit = await ethers.provider.estimateGas({
    //     to: homeFiContract.address,
    //     from: signers[0].address,
    //     data: data,
    // });


    signature = await signer._signTypedData(domain, types, message)

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
    signature,
) => {


    const contractTransactionHash = await safeInstance
        .getTransactionHash(to, valueInWei, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce)

    return {
        safe: toChecksumAddress(safeInstance.address),
        to: toChecksumAddress(to),
        value: valueInWei,
        data,
        operation,
        nonce,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        contractTransactionHash,
        transactionHash,
        sender: toChecksumAddress(sender),
        origin,
        signature,
    }
}

const getTxServiceUrl = () => 'safe-transaction.gnosis.io/api/v1'

export const getSafeServiceBaseUrl = (safeAddress) => `https://${getTxServiceUrl()}/safes/${safeAddress}`

export const buildTxServiceUrl = (safeAddress) => {
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
    console.log('safe', safeInstance)
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
        signature,
    )
    console.log('body', body)
    console.log('url', url)

    const response = await axios.post(url, body)

    console.log('response', response)

    if (response.status !== 201) {
        return Promise.reject(new Error('Error submitting the transaction'))
    }

    return Promise.resolve()
}

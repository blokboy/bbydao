import {TypedDataUtils} from '@metamask/eth-sig-util'
import {ethers}         from 'ethers'

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

export const METAMASK_REJECT_CONFIRM_TX_ERROR_CODE = 4001

export const getEIP712Signer = (version) => async (txArgs) => {
    const typedData = await generateTypedDataFrom(txArgs)
    const jsonTypedData = JSON.stringify(typedData)
    let method = 'eth_signTypedData_v3'
    if (version === 'v4') {
        method = 'eth_signTypedData_v4'
    }
    if (!version) {
        method = 'eth_signTypedData'
    }
    let params = version === 'v3' || version === 'v4' ? [txArgs.sender, jsonTypedData] : [jsonTypedData, txArgs.sender]

    return new Promise((resolve, reject) => {
        const provider = new ethers.providers.JsonRpcProvider();
        const result = provider.send(method, params)

        console.log('result', result)

    })
}

const SIGNERS = {
    EIP712_V3: getEIP712Signer('v3'),
    EIP712_V4: getEIP712Signer('v4'),
    EIP712: getEIP712Signer(),
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


export const tryOffchainSigning = async (safeTxHash, txArgs) => {
    let signature

    const signerByWallet = [SIGNERS.EIP712_V3, SIGNERS.EIP712_V4, SIGNERS.EIP712, SIGNERS.ETH_SIGN]
    for (const signingFunc of signerByWallet) {
        try {
            signature = await signingFunc({ ...txArgs, safeTxHash })

            break
        } catch (err) {
            console.error(err)
            if (err.code === METAMASK_REJECT_CONFIRM_TX_ERROR_CODE) {
                throw err
            }
        }
    }

    return signature
}

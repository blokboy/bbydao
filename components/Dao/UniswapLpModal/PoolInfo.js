import {ethers, BigNumber}                            from 'ethers'
import {minimalABI}                        from 'hooks/useERC20Contract'
import {useMemo, useState}                         from 'react'
import {eToNumber, isEmpty, max256, NumberFromBig} from 'utils/helpers'

const PoolInfo = ({spender, info, signer, hasAllowance, setHasAllowance}) => {
    const token0 = info?.transactionInfo?.[0].token
    const token1 = info?.transactionInfo?.[1].token
    const signerAddress = signer?._address

    const prettyPercentage = (decimal) =>
        decimal * 100 < .01 ? '< .01%' : `${(decimal * 100).toFixed(2)}%`

    const prettyMinted = (amount) =>
        parseFloat(amount)?.toFixed(3)

    const prettyTotal = (amount) =>
        Math.round(amount).toLocaleString("en-US")

    const pairName = info?.transactionInfo?.reduce((acc, cv) => {
        return (acc + cv.token.symbol + '/')
    }, '').slice(0, -1)

    const tokenContracts = useMemo(async () => {
        let token0Contract, token1Contract, token0AllowanceAmount, token1AllowanceAmount

        if (!!signer) {
            if (!!token0) {
                token0Contract = new ethers.Contract(token0?.address, minimalABI, signer)
                const allowance = await token0Contract.allowance(signerAddress, spender)
                token0AllowanceAmount = await NumberFromBig(allowance._hex, token0.decimals)
            }

            if (!!token1) {
                token1Contract = new ethers.Contract(token1?.address, minimalABI, signer)
                const allowance = await token1Contract.allowance(signerAddress, spender)
                token1AllowanceAmount = await NumberFromBig(allowance._hex, token1.decimals)
            }
        }

        return {
            contracts: [
                token0Contract,
                token1Contract
            ],
            allowedToSpend: {token0: token0AllowanceAmount > 0, token1: token1AllowanceAmount > 0}
        }
    }, [token0, token1])

    const handleApproveToken = async (tokenContracts, index) => {
        const contracts = await tokenContracts
        const contract = await contracts.contracts[index]
        const approve = await contract.approve(spender, BigNumber.from(max256))
        console.log('approve', approve)

    }

    useMemo(async () => {
        const allowed = await tokenContracts
        setHasAllowance(allowed.allowedToSpend)

    }, [tokenContracts])

    return (
        <div>
            {!isEmpty(info) && (
                <div className="flex flex-col items-center px-12">
                    <div className="mb-2">
                        <a href={info?.uris?.uniswap} target="_blank" className="underline">{pairName} Uniswap V2 Pool</a>
                    </div>
                    {!!info.uniswapTokensMinted && (
                        <div className="w-full mb-2 bg-[#e4dfe0] dark:bg-[#1e293b] p-3 rounded-xl flex flex-col items-center">
                            <div><a href={info?.uris?.uniswap} target="_blank">Pool</a> Tokens Received</div>
                            <div className="font-thin">~ {prettyMinted(info?.uniswapTokensMinted)}</div>
                        </div>
                    )}
                    {!!info?.percentageOfPool && (
                        <div className="w-full mb-2 bg-[#e4dfe0] dark:bg-[#1e293b] p-3 rounded-xl flex flex-col items-center">
                            <div>Share of <a href={info?.uris?.uniswap} target="_blank">{pairName} Pool</a></div>
                            <div className="font-thin">
                                {prettyPercentage(eToNumber(info?.percentageOfPool))}
                            </div>
                        </div>
                    )}
                    {!!info?.total && (
                        <div className="w-full mb-2 bg-[#e4dfe0] dark:bg-[#1e293b] p-3 rounded-xl flex flex-col items-center">
                            <div>
                                Total Tokens in <a href={info?.uris?.uniswap} target="_blank">{pairName} Pool</a>
                            </div>
                            <div className="font-thin">~ {prettyTotal(info?.total)}</div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 justify-between w-full my-4">
                        {(!hasAllowance.token0 && token0) && (
                            <div
                                className="flex justify-center items-center bg-[#FC8D4D] hover:bg-[#d57239] cursor-pointer rounded-3xl p-4 text-white font-normal"
                                onClick={() => handleApproveToken(tokenContracts, 0)}
                            >
                                Approve {token0?.symbol}
                            </div>
                        )}
                        {(!hasAllowance.token1 && token1) && (
                            <div
                                className="flex justify-center items-center bg-[#FC8D4D] hover:bg-[#d57239] cursor-pointer rounded-3xl p-4 text-white font-normal"
                                onClick={() => handleApproveToken(tokenContracts, 1)}
                            >
                                Approve {token1?.symbol}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PoolInfo

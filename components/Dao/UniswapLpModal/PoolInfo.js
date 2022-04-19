import {eToNumber} from 'utils/helpers'

const PoolInfo = ({info}) => {
    const prettyPercentage = (decimal) =>
        decimal * 100 < .01 ? '< .01%' : `${(decimal * 100).toFixed(2)}%`

    const prettyMinted = (amount) =>
        parseFloat(amount)?.toFixed(3)

    const prettyTotal = (amount) =>
        Math.round(amount).toLocaleString("en-US")

    const pairName = info?.transactionInfo?.reduce((acc, cv) => {
        return (acc + cv.token.symbol + '/')
    }, '').slice(0, -1)

    return (
        <div>
            <div className="flex flex-col items-center px-12">
                <div className="mb-2">
                    <a href={info?.uris?.uniswapPairURI} target="_blank">{pairName} Uniswap V2 Pool</a>
                </div>
                {!!info.uniswapTokensMinted && (
                    <div className="w-full mb-2 bg-[#e4dfe0] p-3 rounded-xl flex flex-col items-center">
                        <div><a href={info?.uris?.uniswapPairURI} target="_blank">Pool</a> Tokens Received</div>
                        <div className="font-thin">~ {prettyMinted(info?.uniswapTokensMinted)}</div>
                    </div>
                )}
                {!!info?.percentageOfPool && (
                    <div className="w-full mb-2 bg-[#e4dfe0] p-3 rounded-xl flex flex-col items-center">
                        <div>Share of <a href={info?.uris?.uniswapPairURI} target="_blank">{pairName} Pool</a></div>
                        <div className="font-thin">
                            {prettyPercentage(eToNumber(info?.percentageOfPool))}
                        </div>
                    </div>
                )}
                {!!info?.total && (
                    <div className="w-full mb-2 bg-[#e4dfe0] p-3 rounded-xl flex flex-col items-center">
                        <div>
                            Total Tokens in <a href={info?.uris?.uniswapPairURI} target="_blank">{pairName} Pool</a>
                        </div>
                        <div className="font-thin">~ {prettyTotal(info?.total)}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PoolInfo

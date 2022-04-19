import {eToNumber} from 'utils/helpers'

const LPInfo = ({info}) => {
    const shareOfPool = eToNumber(info?.percentageOfPool)
    const getPercentage = (decimal) => {
        return decimal * 100 < .01 ? '< .01%' : `${(decimal * 100).toFixed(2)}%`
    }
    // const pairNames = info?.transactionInfo?.reduce((acc, cv) => {
    //     return (acc + cv.token.symbol + '/').slice(0, -1)
    // }, '')
    //
    // console.log('info', pairNames)

    return (
        <div>
            <div className="flex flex-col items-center">
                {!!info.uniswapTokensMinted && (
                    <div className="w-full mb-2 bg-[#e4dfe0] p-3 rounded-xl flex flex-col items-center">
                        <div><a href={info.uniswapPairURI} target="_blank">Pool</a> Tokens Received</div>
                        <div className="font-thin">{info?.uniswapTokensMinted}</div>
                    </div>
                )}
                {!!info?.percentageOfPool && (
                    <div className="w-full mb-2 bg-[#e4dfe0] p-3 rounded-xl flex flex-col items-center">
                        <div>Share of <a href={info.uniswapPairURI} target="_blank">Pool</a></div>
                        <div className="font-thin">
                            {getPercentage(shareOfPool)}
                        </div>
                    </div>
                )}
                {!!info?.total && (
                    <div className="w-full mb-2 bg-[#e4dfe0] p-3 rounded-xl flex flex-col items-center">
                        <div>
                            Total Tokens in <a href={info.uniswapPairURI} target="_blank">Pool</a>
                        </div>
                        <div className="font-thin">{info?.total}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LPInfo

import {eToNumber} from 'utils/helpers'

const LPInfo = ({info}) => {
    return (
        <div>
            <div>Uniswap Tokens to be received: {info?.uniswapTokensMinted}</div>
            {!!info?.percentageOfPool && (
                <div>Percentage of Liquidity Pool: {eToNumber(info?.percentageOfPool)}</div>
            )}

            <div>Total Liquidity Tokens in pool: {info?.total}</div>

        </div>
    )
}

export default LPInfo

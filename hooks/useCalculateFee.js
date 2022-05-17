import {ChainId, Fetcher, Token} from '@uniswap/sdk'
import IUniswapV2Pair            from '@uniswap/v2-periphery/build/IUniswapV2Pair.json'
import {ethers}                  from 'ethers'
import React                     from 'react'
import {useSigner}               from 'wagmi'

export default function useCalculateFee() {
    const {data: signer} = useSigner()

    // tokens: Array of {value, token}
    // value: BigNumber
    // token: Object, {address, decimals, symbol, name} --- optional for WETH/ETH
    const calculateFee = React.useCallback(async (tokens) => {
        try {
            let totalFee = 0
            for(const t of tokens) {
                const {token, value} = t
                const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
                const percentage = 0.01
                let fee

                if (!token || token.address === WETH) {
                    fee = parseFloat(ethers.utils.formatEther(value)) * percentage
                    return ethers.utils.parseEther(fee.toString())
                }

                const token0 = new Token(ChainId.MAINNET, WETH, 18, "WETH", "Wrapped Ether")
                const token1 = new Token(ChainId.MAINNET, token?.address, token?.decimals, token?.symbol, token?.name)
                const uniPair = await Fetcher.fetchPairData(token0, token1)
                const pairContract = new ethers.Contract(
                    ethers.utils.getAddress(uniPair.liquidityToken.address),
                    IUniswapV2Pair["abi"],
                    signer
                )
                const reserves = await pairContract?.getReserves()
                const priceOfWETHInToken = Number(
                    (Number(reserves[0]) * token0.decimals) / (Number(reserves[1]) * token1.decimals)
                ).toFixed(18)
                const bigNumberPriceOfWETHInToken = ethers.utils.parseUnits((priceOfWETHInToken.toString()), token1.decimals)
                const valueInEth =  (parseFloat(ethers.utils.formatEther(value)) / parseFloat(ethers.utils.formatEther(bigNumberPriceOfWETHInToken)))
                fee = valueInEth * percentage
                totalFee += fee
            }
            return ethers.utils.parseEther(totalFee.toString())

        } catch (err) {
            console.log("err", err)
        }
    }, [])

    return {calculateFee}
}

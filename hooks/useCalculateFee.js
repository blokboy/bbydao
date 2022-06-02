import { ChainId, Fetcher, Token } from "@uniswap/sdk"
import IUniswapV2Pair from "@uniswap/v2-periphery/build/IUniswapV2Pair.json"
import { ethers } from "ethers"
import React from "react"
import { useLayoutStore } from "stores/useLayoutStore"

export default function useCalculateFee() {
  const signer = useLayoutStore(state => state.signer)
  const signerAddress = React.useMemo(() => {
    return signer ? signer._address : null
  }, [signer])

  // tokens: Array of {value, token}
  // value: BigNumber
  // token: Object, {address, decimals, symbol, name} --- optional for WETH/ETH
  const calculateFee = React.useCallback(
    async tokens => {
      try {
        if (!signerAddress) {
          throw new Error("no signer address or no bbyDao Safe instance or safe SDK")
        }

        let totalFee = 0
        for (const t of tokens) {
          const { token, value } = t
          const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
          const percentage = 0.01
          let fee

          if (!token || token.address === WETH) {
            //to prevent underflow, feels arbitrary can find better fix that toFixed(6)
            fee = (parseFloat(ethers.utils.formatEther(value)) * percentage).toFixed(6)
            totalFee += parseFloat(fee.toString())
          } else {
            const token0 = new Token(ChainId.MAINNET, WETH, 18, "WETH", "Wrapped Ether")
            const token1 = new Token(ChainId.MAINNET, token?.address, token?.decimals, token?.symbol, token?.name)
            const uniPair = await Fetcher.fetchPairData(token0, token1)
            const pairContract = new ethers.Contract(
              ethers.utils.getAddress(uniPair.liquidityToken.address),
              IUniswapV2Pair["abi"],
              signer
            )
            const reserves = await pairContract?.getReserves()
            const WETHReserve = uniPair?.tokenAmounts[0]?.token?.symbol === "WETH" ? reserves[0] : reserves[1]
            const PairReserve = uniPair?.tokenAmounts[0]?.token?.symbol !== "WETH" ? reserves[0] : reserves[1]
            const priceOfWETHInToken = (
              parseFloat(ethers.utils.formatUnits(PairReserve, token1?.decimals)) /
              parseFloat(ethers.utils.formatEther(WETHReserve))
            ).toFixed(6) //to prevent underflow, feels arbitrary can find better fix that toFixed(6)

            const valueInEth = parseFloat(ethers.utils.formatEther(value)) / priceOfWETHInToken

            fee = valueInEth * percentage
            totalFee += parseFloat(fee.toString())
          }
        }

        return ethers.utils.parseEther(totalFee.toFixed(18))
      } catch (err) {
        console.log("err", err)
      }
    },
    [signer]
  )

  return { calculateFee }
}

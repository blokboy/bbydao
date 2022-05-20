import { ChainId } from "@uniswap/sdk"
import { ethers } from "ethers"
import React from "react"
import { useQueryClient } from "react-query"
import { flatten } from "utils/helpers"
import IUniswapV2Pair from "@uniswap/v2-periphery/build/IUniswapV2Pair.json"
import { useSigner } from "wagmi"
import TokenBalance from "./TokenBalance"
import TokenControls from "./TokenControls"
import TokenImg from "./TokenImg"
import TokenName from "./TokenName"

const TokenCard = ({ token, isMember }) => {
  const { data: signer } = useSigner()
  const queryClient = useQueryClient()
  const bbyDao = queryClient.getQueryData("expandedDao")
  const treasury = React.useMemo(() => {
    if (!bbyDao) {
      return
    }

    return queryClient.getQueryData(["daoTokens", bbyDao])
  }, [bbyDao])
  const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
  const isEth = React.useMemo(() => {
    return parseInt(token?.ethValue) === 1 && token?.token === null && token?.tokenAddress === null
  }, [token])
  const _token = React.useMemo(() => {
    if (isEth) {
      return flatten({
        ...token,
        token: {
          decimals: 18,
          logoURI: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
          name: "Ether",
          symbol: "ETH",
        },
        address: WETH,
        tokenAddress: "",
      })
    }

    return flatten({ ...token, address: token?.tokenAddress, logoURI: token?.token?.logoUri })
  }, [token])
  const isUniV2 = _token?.symbol === "UNI-V2"
  const defaultEth = {
    address: WETH,
    tokenAddress: WETH,
    chainId: ChainId.MAINNET,
    decimals: 18,
    logoURI: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
    name: "Ether",
    symbol: "ETH",
  }

  /* If bbyDao has LP, check to see if they have both pair tokens in their treasury  */
  const [liquidityPair, setLiquidityPair] = React.useState()
  React.useMemo(async () => {
    if (_token.symbol === "UNI-V2" && !!signer) {
      const pairContract = new ethers.Contract(
        ethers.utils.getAddress(_token?.tokenAddress),
        IUniswapV2Pair["abi"],
        signer
      )
      const address0 = ethers.utils.getAddress(await pairContract?.token0())
      const address1 = ethers.utils.getAddress(await pairContract?.token1())
      let lpToken0 = treasury?.filter(token =>
        token?.tokenAddress === null ? WETH === address0 : token?.tokenAddress === address0
      )?.[0]
      let lpToken1 = treasury?.filter(token =>
        token?.tokenAddress === null ? WETH === address1 : token?.tokenAddress === address1
      )?.[0]

      if (!!lpToken0 && lpToken0.token === null && lpToken0.tokenAddress === null) {
        lpToken0 = {
          ...defaultEth,
          balance: lpToken0?.balance,
          ethValue: lpToken0?.ethValue,
          fiatBalance: lpToken0?.fiatBalance,
        }
      }

      if (!!lpToken1 && lpToken1.token === null && lpToken1.tokenAddress === null) {
        lpToken1 = {
          ...defaultEth,
          balance: lpToken1?.balance,
          ethValue: lpToken1?.ethValue,
          fiatBalance: lpToken1?.fiatBalance,
        }
      }

      if (!!lpToken0 && !!lpToken1) {
        setLiquidityPair({ lpToken0: flatten(lpToken0), lpToken1: flatten(lpToken1) })
      }
    }
  }, [_token, signer, treasury])

  return (
    <div className="flex w-full flex-col rounded-xl bg-slate-100 p-2 shadow-xl dark:bg-slate-900">
      <div className="mb-2 flex w-full flex-col">
        <div className="flex items-center">
          <TokenImg token={_token} isUniV2={isUniV2} />
          <TokenName token={_token} isUniV2={isUniV2} />
        </div>
        <TokenBalance token={_token} />
      </div>

      {isMember && <TokenControls liquidityPair={liquidityPair} token={_token} isUniV2={isUniV2} treasury={treasury} />}
    </div>
  )
}

export default TokenCard

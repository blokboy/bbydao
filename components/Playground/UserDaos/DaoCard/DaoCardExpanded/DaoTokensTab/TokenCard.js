import { ChainId } from "@uniswap/sdk"
import { ethers }         from "ethers"
import React              from "react"
import { FaEthereum }     from "react-icons/fa"
import RemoveLiquidity    from "components/Dao/Uniswap/RemoveLiquidity"
import Modal              from "components/Layout/Modal"
import Swap               from "components/Dao/Uniswap/Swap"
import AddLiquidity       from "components/Dao/Uniswap/AddLiquidity"
import { useQueryClient } from "react-query"
import { flatten }        from "utils/helpers"
import IUniswapV2Pair     from "@uniswap/v2-periphery/build/IUniswapV2Pair.json"
import { useSigner }      from "wagmi"
import TokenControls      from './TokenControls'

const TokenCard = ({ token, isMember }) => {
  const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
  const isEth = React.useMemo(() => {
    return parseInt(token?.ethValue) === 1 && token?.token === null && token?.tokenAddress === null
  }, [token])
  const { data: signer } = useSigner()
  const queryClient = useQueryClient()
  const bbyDao = queryClient.getQueryData("expandedDao")
  const treasury = React.useMemo(() => {
    if (!bbyDao) {
      return
    }

    return queryClient.getQueryData(["daoTokens", bbyDao])
  }, [bbyDao])

  const token0 = React.useMemo(() => {
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
  const isUniV2 = token0?.symbol === "UNI-V2"
  const defaultEth = {
    address: WETH,
    tokenAddress: WETH,
    chainId: ChainId.MAINNET,
    decimals: 18,
    logoURI: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
    name: "Ether",
    symbol: "ETH",
  }
  const [liquidityPair, setLiquidityPair] = React.useState()
  React.useMemo(async () => {
    if (token0.symbol === "UNI-V2" && !!signer) {
      const pairContract = new ethers.Contract(
        ethers.utils.getAddress(token0?.tokenAddress),
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
  }, [token0, signer, treasury])

  return (
    <div className="flex w-full flex-row rounded-xl bg-slate-100 p-2 shadow-xl dark:bg-slate-900 xl:flex-col">
      <div className="mb-2 flex w-full flex-col">
        <div className="flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            {(isUniV2 && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Uniswap_Logo.svg" alt="Uniswap Logo" />
            )) || <>{token0.logoUri ? <img src={token0.logoUri} alt={""} /> : <FaEthereum size={30} />}</>}
          </div>
          <span className="text-xl font-normal">
            {(isUniV2 && <>{token0.name.replace("Uniswap V2", "").replace("Pool", "LP")}</>) || (
              <>{token0.name ? token0.name : "Ethereum"}</>
            )}
          </span>
        </div>
        <div className="flex h-full w-auto flex-col p-2">
          <span className="text-sm font-thin">
            {(token0?.balance / 10 ** 18).toFixed(3)} {token0.symbol}
          </span>
          <span className="text-xs font-thin text-teal-600 dark:text-teal-400">
            ${Number(token0?.fiatBalance).toFixed(2)}
          </span>
        </div>
      </div>

      {isMember && (
          <TokenControls
              liquidityPair={liquidityPair}
              token={token0}
              isUniV2={isUniV2}
          />
      )}
    </div>
  )
}

export default TokenCard

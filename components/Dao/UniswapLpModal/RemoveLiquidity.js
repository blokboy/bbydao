import { ChainId, Fetcher, Token, TokenAmount } from "@uniswap/sdk"
import { BigNumber, ethers } from "ethers"
import React, { useEffect, useState } from "react"
import { useQueryClient } from "react-query"
import { useSigner } from "wagmi"
import useForm from "hooks/useForm"
import IUniswapV2Pair from "@uniswap/v2-periphery/build/IUniswapV2Pair.json"
import UniswapV2ERC20 from "@uniswap/v2-core/build/UniswapV2ERC20.json"
import IUniswapV2Router02 from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"
import { max256, NumberFromBig } from "utils/helpers"
import { minimalABI } from "hooks/useERC20Contract"
import { amount } from "./helpers"
import useGnosisTransaction from "hooks/useGnosisTransaction"

const RemoveLiquidity = ({ token }) => {
  const [{ data: signer }] = useSigner()
  const queryClient = useQueryClient()
  const bbyDao = queryClient.getQueryData("expandedDao")
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const [breakDown, setBreakDown] = useState({})
  const [toReceive, setToReceive] = useState({})
  const { state, setState, handleChange } = useForm()

  const pairName = token?.token?.name.replace("Uniswap V2", "").replace("Pool", "")
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const { liquidity } = state
  const { tokenAddress, token: pairToken } = token
  const slippage = 0.055

  /* Contracts */
  const uniswapV2RouterContract02 = new ethers.Contract(UniswapV2Router02, IUniswapV2Router02["abi"], signer)
  const pairContract = new ethers.Contract(ethers.utils.getAddress(tokenAddress), IUniswapV2Pair["abi"], signer)
  const pairERC20Contract = new ethers.Contract(
      ethers.utils.getAddress(tokenAddress),
      UniswapV2ERC20["abi"],
      signer
  )


  React.useMemo(async () => {
    if (!!signer) {
      const WETH = await uniswapV2RouterContract02?.WETH()
      const totalSupply = await pairContract?.totalSupply()
      const bbyDaoBalance = await pairERC20Contract?.balanceOf(bbyDao)

      const percentageOfPool = NumberFromBig(bbyDaoBalance, pairToken?.decimals) / NumberFromBig(totalSupply, pairToken?.decimals)
      const bbyDaoAllowance = await pairERC20Contract?.allowance(bbyDao, UniswapV2Router02)
      const kLast = await pairContract?.kLast()
      const reserves = await pairContract?.getReserves()


      /* Construct Uniswap Token Objects  */
      const token0Contract = new ethers.Contract(
        ethers.utils.getAddress(await pairContract?.token0()),
        minimalABI,
        signer
      )
      const token1Contract = new ethers.Contract(
        ethers.utils.getAddress(await pairContract?.token1()),
        minimalABI,
        signer
      )

      const token0 = {
        address: await pairContract?.token0(),
        decimals: await token0Contract?.decimals(),
        symbol: await token0Contract?.symbol(),
        name: await token0Contract?.name(),
        reserves: reserves[0],
      }

      const token1 = {
        address: await pairContract?.token1(),
        decimals: await token1Contract?.decimals(),
        symbol: await token1Contract?.symbol(),
        name: await token1Contract?.name(),
        reserves: reserves[1],
      }

      const uniswapTokens = async () => {
        const uniToken0 = new Token(ChainId.MAINNET, token0?.address, token0?.decimals, token0?.symbol, token0?.name)
        const uniToken1 = new Token(ChainId.MAINNET, token1?.address, token1?.decimals, token1?.symbol, token1?.name)
        return { [token0.symbol]: uniToken0, [token1.symbol]: uniToken1 }
      }

      /* Get Price Of Data  */
      const priceOfToken1InToken0 = Number(
        (Number(token0.reserves) * token0.decimals) / (Number(token1.reserves) * token1.decimals)
      )
      const priceOfToken0InToken1 = Number(
        (Number(token1.reserves) * token1.decimals) / (Number(token0.reserves) * token0.decimals)
      )

      /*  Fetch Data about PAir */
      const uniTokens = await uniswapTokens()
      const uniPair = await Fetcher.fetchPairData(uniTokens[token0.symbol], uniTokens[token1.symbol])


      const totalTokenSupplyOfLP = new TokenAmount(uniPair?.liquidityToken, totalSupply)
      const totalBbyDaoLPTokens = new TokenAmount(uniPair?.liquidityToken, bbyDaoBalance)
      const token0Amount = uniPair
        ?.getLiquidityValue(
          uniPair.tokenAmounts[0].token,
          totalTokenSupplyOfLP,
          totalBbyDaoLPTokens,
          false,
          kLast
        )
        .toFixed(pairToken.decimals)
      const token1Amount = uniPair
        ?.getLiquidityValue(
          uniPair.tokenAmounts[1].token,
          totalTokenSupplyOfLP,
          totalBbyDaoLPTokens,
          false,
          kLast
        )
        .toFixed(pairToken.decimals)

      setToReceive({
        token0Amount,
        token1Amount,
      })

      setBreakDown({
        WETH,
        bbyDaoBalance,
        poolTokens: NumberFromBig(bbyDaoBalance, pairToken?.decimals),
        hasAllowance: parseFloat(amount(bbyDaoAllowance, pairToken?.decimals)) > 0,
        pairContract,
        percentageOfPool: `${
          percentageOfPool * 100 < 0.01 ? "< 0.01" : parseFloat((percentageOfPool * 100).toString()).toFixed(6)
        }%`,
        token0: {
          address: token0.address,
          name: token0.name,
          symbol: token0.symbol,
          priceInPair: priceOfToken0InToken1,
          amount: token0Amount,
        },
        token1: {
          address: token1.address,
          name: token1.name,
          symbol: token1.symbol,
          priceInPair: priceOfToken1InToken0,
          amount: token1Amount,
        },
      })
    }
  }, [tokenAddress, signer, bbyDao, pairToken])

  useEffect(() => {
    console.log('liq', liquidity)
    console.log('br', breakDown?.token0)
    if (!!breakDown?.token0?.amount || !!breakDown?.token?.amount) {
      console.log('hii')
      setToReceive({
        token0: breakDown?.token0?.amount * (liquidity / 100),
        token1: breakDown?.token1?.amount * (liquidity / 100),
      })
    }
  }, [liquidity])

  const init = () => {
    if (!liquidity) setState({ liquidity: 0 })
  }
  useEffect(() => {
    init()
  }, [])

  const handleApprovePair = async contract => {
    gnosisTransaction(
      {
        abi: IUniswapV2Pair["abi"],
        instance: contract,
        args: {
          spender: UniswapV2Router02,
          value: BigNumber.from(max256),
        },
        fn: "approve(address,uint256)",
      },
      contract?.address,
      0
    )
  }

  const handleRemoveLiquidity = () => {
    const amountAMin = ethers.utils.parseUnits((toReceive.token0 - toReceive.token0 * slippage).toString())
    const amountBMin = ethers.utils.parseUnits((toReceive.token1 - toReceive.token1 * slippage).toString())
    const amountMins = {
      [breakDown.token0.symbol]: amountAMin,
      [breakDown.token1.symbol]: amountBMin,
    }
    const addresses = [breakDown.token0, breakDown.token1]
    const hasWETH = addresses.filter(item => item.address === breakDown.WETH).length > 0

    if (hasWETH) {
      const WETHToken = addresses?.filter(item => item.address === breakDown.WETH)?.[0]
      const pairToken = addresses?.filter(item => item.address !== breakDown.WETH)?.[0]
      const amountTokenMin = amountMins[pairToken.symbol]
      const amountETHMin = amountMins[WETHToken.symbol]
      const percentageOfLiquidityToRemove = ((liquidity / 100) * breakDown?.bbyDaoBalance).toString()

      gnosisTransaction(
        {
          abi: IUniswapV2Router02["abi"],
          instance: uniswapV2RouterContract02,
          fn: "removeLiquidityETH(address,uint256,uint256,uint256,address,uint256)",
          args: {
            token: ethers.utils.getAddress(pairToken?.address),
            liquidity: percentageOfLiquidityToRemove,
            amountTokenMin,
            amountETHMin,
            addressTo: ethers.utils.getAddress(bbyDao),
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          },
        },
        UniswapV2Router02,
        0
      )
    } else {
      gnosisTransaction(
        {
          abi: IUniswapV2Router02["abi"],
          instance: uniswapV2RouterContract02,
          fn: "removeLiquidity(address,address,uint256,uint256,uint256,address,uint256)",
          args: {
            tokenA: ethers.utils.getAddress(breakDown.token0.address),
            tokenB: ethers.utils.getAddress(breakDown.token1.address),
            liquidity: percentageOfLiquidityToRemove,
            amountAMin,
            amountBMin,
            addressTo: ethers.utils.getAddress(bbyDao),
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          },
        },
        UniswapV2Router02,
        0
      )
    }
  }

  return (
    <div>
      <div className="mt-2 rounded-xl bg-[#eda67e24] p-4 font-thin text-[#FC8D4D]">
        <span className="font-bold">Tip:</span> Removing pool tokens converts your position back into underlying tokens
        at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you
        receive.
      </div>
      <div className="flex flex-col">
        Remove Amount
        <div className="text-4xl">{liquidity} %</div>
        <input
          name="liquidity"
          type="range"
          aria-labelledby="input slider"
          step="1"
          min="0"
          max="100"
          onChange={handleChange}
          value={liquidity || 0}
        />
        <div className="grid grid-cols-2">
          <button
            className={`m-2 rounded bg-slate-300 p-4 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700`}
            onClick={() => setState({ liquidity: 25 })}
          >
            25%
          </button>
          <button
            className={`m-2 rounded bg-slate-300 p-4 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700`}
            onClick={() => setState({ liquidity: 50 })}
          >
            50%
          </button>
          <button
            className={`m-2 rounded bg-slate-300 p-4 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700`}
            onClick={() => setState({ liquidity: 75 })}
          >
            75%
          </button>
          <button
            className={`m-2 rounded bg-slate-300 p-4 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700`}
            onClick={() => setState({ liquidity: 100 })}
          >
            MAX
          </button>
        </div>
        <div className="mb-2 rounded border p-4">
          Amount of Tokens You will Receive back
          <div>
            <div>{breakDown?.token0?.symbol}</div>
            <div>{toReceive?.token0}</div>
          </div>
          <div>
            <div>{breakDown?.token1?.symbol}</div>
            <div>{toReceive?.token1}</div>
          </div>
        </div>
        <div>
          <div>
            <div>Your Position</div>
            <div>{pairName}</div>
            <div>Your Total Pool Tokens: {breakDown?.poolTokens}</div>
            <div>Your Pool Share: {breakDown?.percentageOfPool}</div>
            <div>
              {breakDown?.token0?.symbol}: {breakDown?.token0?.amount}
            </div>
            <div>
              {breakDown?.token1?.symbol}: {breakDown?.token1?.amount}
            </div>
          </div>
          <div>
            <div>Price</div>
            <div>
              1 {breakDown?.token0?.symbol} = {breakDown?.token0?.priceInPair} {breakDown?.token1?.symbol}
            </div>
            <div>
              1 {breakDown?.token1?.symbol} = {breakDown?.token1?.priceInPair} {breakDown?.token0?.symbol}
            </div>
          </div>
        </div>
      </div>

      {(breakDown.hasAllowance === false && (
        <div
          className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
          onClick={() => handleApprovePair(breakDown?.pairContract)}
        >
          Approve {pairName} UNI-V2 LP Token
        </div>
      )) || (
        <button
          onClick={() => handleRemoveLiquidity()}
          className={`"bg-slate-200" : "bg-[#FC8D4D] dark:hover:bg-[#10172a]" } focus:shadow-outline "border-[#e1793d] dark:border-[#10172a]" }
          mt-4 h-16 w-full appearance-none rounded-full border border py-2 px-3 text-xl leading-tight hover:bg-[#e1793d]
          focus:outline-none dark:bg-slate-800`}
        >
          Remove
        </button>
      )}
    </div>
  )
}

export default RemoveLiquidity

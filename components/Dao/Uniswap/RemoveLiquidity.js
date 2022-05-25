import React, {useEffect}                       from "react"
import { ChainId, Fetcher, Token, TokenAmount } from "@uniswap/sdk"
import { BigNumber, ethers } from "ethers"
import useForm                   from "hooks/useForm"
import IUniswapV2Pair            from "@uniswap/v2-periphery/build/IUniswapV2Pair.json"
import UniswapV2ERC20            from "@uniswap/v2-core/build/UniswapV2ERC20.json"
import IUniswapV2Router02        from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"
import { max256, NumberFromBig } from "utils/helpers"
import { minimalABI }            from "hooks/useERC20Contract"
import { useLayoutStore }        from "stores/useLayoutStore"
import { usePlaygroundStore }    from "stores/usePlaygroundStore"
import { amount }                from "./helpers"
import useGnosisTransaction      from "hooks/useGnosisTransaction"
import useCalculateFee from "hooks/useCalculateFee"
import Slippage        from '../Slippage'

const RemoveLiquidity = ({ token }) => {
  const bbyDao = usePlaygroundStore(state => state.expandedDao)
  const signer = useLayoutStore(state => state.signer)
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const { calculateFee } = useCalculateFee()
  const [breakDown, setBreakDown] = React.useState(undefined)
  const [toReceive, setToReceive] = React.useState({})
  const { state, setState, handleChange } = useForm()
  const pairName = token?.name.replace("Uniswap V2", "").replace("Pool", "")
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const { liquidity } = state
  const { address } = token

  /* init slippage */
  const defaultSlippage = 0.005
  useEffect(() => {
    setState({ slippage: defaultSlippage * 100 })
  }, [])

  /* Contracts */
  const uniswapV2RouterContract02 = new ethers.Contract(UniswapV2Router02, IUniswapV2Router02["abi"], signer)
  const pairContract = new ethers.Contract(ethers.utils.getAddress(address), IUniswapV2Pair["abi"], signer)
  const pairERC20Contract = new ethers.Contract(ethers.utils.getAddress(address), UniswapV2ERC20["abi"], signer)

  React.useMemo(async () => {
    if (!!signer) {
      try {
        const WETH = await uniswapV2RouterContract02?.WETH()
        const totalSupply = await pairContract?.totalSupply()
        const bbyDaoBalance = await pairERC20Contract?.balanceOf(bbyDao)

        const percentageOfPool =
          NumberFromBig(bbyDaoBalance, token?.decimals) / NumberFromBig(totalSupply, token?.decimals)
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
          ?.getLiquidityValue(uniPair.tokenAmounts[0].token, totalTokenSupplyOfLP, totalBbyDaoLPTokens, false, kLast)
          .toFixed(token.decimals)
        const token1Amount = uniPair
          ?.getLiquidityValue(uniPair.tokenAmounts[1].token, totalTokenSupplyOfLP, totalBbyDaoLPTokens, false, kLast)
          .toFixed(token.decimals)

        setBreakDown({
          WETH,
          bbyDaoBalance,
          poolTokens: NumberFromBig(bbyDaoBalance, token?.decimals),
          hasAllowance: parseFloat(amount(bbyDaoAllowance, token?.decimals)) > 0,
          pairContract,
          percentageOfPool: `${
            // percentageOfPool * 100 < 0.01 ? "< 0.01" : parseFloat((percentageOfPool * 100).toString()).toFixed(6)
            parseFloat((percentageOfPool * 100).toString()).toFixed(6)
          }%`,
          token0: {
            address: token0.address,
            name: token0.name,
            symbol: token0.symbol,
            decimals: token0.decimals,
            priceInPair: priceOfToken0InToken1,
            amount: token0Amount,
          },
          token1: {
            address: token1.address,
            name: token1.name,
            symbol: token1.symbol,
            decimals: token1.decimals,
            priceInPair: priceOfToken1InToken0,
            amount: token1Amount,
          },
        })
      } catch (err) {
        console.log("err", err)
      }
    }
  }, [address, signer, bbyDao, token])

  React.useEffect(() => {
    setToReceive({
      token0: (breakDown?.token0?.amount * (liquidity / 100)).toFixed(5) || 0,
      token1: (breakDown?.token1?.amount * (liquidity / 100)).toFixed(5) || 0,
    })
  }, [liquidity, breakDown])

  const init = () => {
    if (!liquidity) setState({ liquidity: 0 })
  }
  React.useEffect(() => {
    init()
  }, [])

  const handleApprovePair = async contract => {
    try {
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
    } catch (err) {
      console.log("err", err)
    }
  }

  const handleRemoveLiquidity = async () => {
    //undeflow issue because of slippage calculation, toFixed(6) feels a bit arbitrary, can find better solution
    const slippage = state?.slippage / 100 || defaultSlippage
    const amountAMin = ethers.utils.parseUnits(
      (toReceive.token0 - toReceive.token0 * slippage).toFixed(6).toString(),
      toReceive?.token0?.decimals
    )
    const amountBMin = ethers.utils.parseUnits(
      (toReceive.token1 - toReceive.token1 * slippage).toFixed(6).toString(),
      toReceive?.token1?.decimals
    )
    const amountMins = {
      [breakDown.token0.symbol]: amountAMin,
      [breakDown.token1.symbol]: amountBMin,
    }
    const addresses = [breakDown.token0, breakDown.token1]
    const hasWETH = addresses.filter(item => item.address === breakDown.WETH).length > 0
    const percentageOfLiquidityToRemove =
      liquidity === 100 ? breakDown?.bbyDaoBalance : ((liquidity / 100) * breakDown?.bbyDaoBalance).toString()

    if (hasWETH) {
      const WETHToken = addresses?.filter(item => item.address === breakDown.WETH)?.[0]
      const pairToken = addresses?.filter(item => item.address !== breakDown.WETH)?.[0]
      const amountTokenMin = amountMins[pairToken.symbol]
      const amountETHMin = amountMins[WETHToken.symbol]
      const fee = await calculateFee([{ value: amountTokenMin, token: pairToken }, { value: amountETHMin }])

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
        0,
        fee
      )
    } else {
      const fee = await calculateFee([
        { value: amountAMin, token: breakDown.token0 },
        { value: amountBMin, token: breakDown.token1 },
      ])
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
        0,
        fee
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
        <div className="my-2 rounded-3xl bg-gray-100 p-4 dark:bg-slate-800">
          <div className="w-full">
            <div className="font-light">Remove Amount</div>
            <div className="text-5xl">{liquidity} %</div>
            <input
              name="liquidity"
              type="range"
              aria-labelledby="input slider"
              step="1"
              min="0"
              max="100"
              onChange={breakDown ? handleChange : () => {}}
              value={liquidity || 0}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-4">
            <button
              className={`m-2 rounded bg-slate-300 p-4 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700`}
              onClick={breakDown ? () => setState({ liquidity: 25 }) : () => {}}
            >
              25%
            </button>
            <button
              className={`m-2 rounded bg-slate-300 p-4 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700`}
              onClick={breakDown ? () => setState({ liquidity: 50 }) : () => {}}
            >
              50%
            </button>
            <button
              className={`m-2 rounded bg-slate-300 p-4 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700`}
              onClick={breakDown ? () => setState({ liquidity: 75 }) : () => {}}
            >
              75%
            </button>
            <button
              className={`m-2 rounded bg-slate-300 p-4 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700`}
              onClick={breakDown ? () => setState({ liquidity: 100 }) : () => {}}
            >
              MAX
            </button>
          </div>
        </div>

        <div className="my-2 rounded-3xl bg-gray-100 p-4 dark:bg-slate-800">
          {breakDown && (
            <div className="text-3xl font-normal">
              <div className="flex justify-between py-2">
                <div>{toReceive?.token0}</div>
                <div>{breakDown?.token0?.symbol}</div>
              </div>
              <div className="flex justify-between py-2">
                <div>{toReceive?.token1}</div>
                <div>{breakDown?.token1?.symbol}</div>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="my-2 rounded-3xl bg-gray-100 p-4 font-light dark:bg-slate-800">
            <div className="mb-4">Your Position</div>

            <div className="flex justify-between text-xl">
              <div>{pairName}</div>
              <div>{breakDown?.poolTokens}</div>
            </div>
            {breakDown && (
              <>
                <div className="flex justify-between">
                  <div>Your Pool Share:</div>
                  <div>{breakDown?.percentageOfPool}</div>
                </div>

                <div className="flex justify-between">
                  <div>{breakDown?.token0?.symbol}: </div>
                  <div>{Number(breakDown?.token0?.amount)?.toFixed(5)}</div>
                </div>
                <div className="flex justify-between">
                  <div>{breakDown?.token1?.symbol}:</div>
                  <div>{Number(breakDown?.token1?.amount)?.toFixed(5)}</div>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 flex justify-between font-light">
            {breakDown && (
              <>
                <div>Price</div>
                <div className="text-right text-sm">
                  <div>
                    1 {breakDown?.token0?.symbol} = {breakDown?.token0?.priceInPair} {breakDown?.token1?.symbol}
                  </div>
                  <div>
                    1 {breakDown?.token1?.symbol} = {breakDown?.token1?.priceInPair} {breakDown?.token0?.symbol}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="my-6 flex gap-4">
        {breakDown && (
          <button
            className={`focus:shadow-outline mt-4 h-16 w-full appearance-none rounded-full bg-slate-200
          bg-slate-300 p-4 py-2 px-3 text-xl leading-tight focus:outline-none ${
            breakDown.hasAllowance === true ? `dark:bg-slate-800` : "dark:bg-orange-600 dark:hover:bg-orange-700"
          }`}
            onClick={breakDown.hasAllowance === false ? () => handleApprovePair(breakDown?.pairContract) : null}
            disabled={breakDown.hasAllowance === true}
          >
            {breakDown.hasAllowance === false ? `Approve ${pairName} UNI-V2 LP Token` : `Approved`}
          </button>
        )}
        {breakDown && breakDown?.hasAllowance === true && liquidity > 0 && (
          <button
            onClick={() => handleRemoveLiquidity()}
            className={`focus:shadow-outline mt-4 h-16 w-full appearance-none rounded-full
           bg-sky-500 p-4 py-2 px-3 text-xl leading-tight hover:bg-sky-600 focus:outline-none
          dark:bg-orange-600 dark:hover:bg-orange-700`}
          >
            Remove Liquidity
          </button>
        )}
      </div>
      <Slippage value={state?.slippage} handleChange={handleChange} defaultSlippage={defaultSlippage * 100} />
    </div>
  )
}

export default RemoveLiquidity

import {BigNumber, ethers}                         from "ethers"
import React, { useCallback, useEffect, useState } from "react"
import { useQueryClient }                          from "react-query"
import { useSigner }                               from "wagmi"
import useForm                                     from "hooks/useForm"
import IUniswapV2Pair                              from "@uniswap/v2-periphery/build/IUniswapV2Pair.json"
import UniswapV2ERC20                              from "@uniswap/v2-core/build/UniswapV2ERC20.json"
import {max256, NumberFromBig}                     from 'utils/helpers'
import {toBN}                                      from 'web3-utils'
import {minimalABI}                                from '../../../hooks/useERC20Contract'
import {amount, handleGnosisTransaction}           from './helpers'

const RemoveLiquidity = ({ token }) => {
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const [{ data: signer }] = useSigner()
  const { state, setState, handleChange } = useForm()
  const { liquidity } = state
  const { tokenAddress, decimals, token: pairToken } = token
  const queryClient = useQueryClient()
  const bbyDao = queryClient.getQueryData("expandedDao")
  const [breakDown, setBreakDown] = useState({})
  const pairName = token?.token?.name.replace("Uniswap V2", "").replace("Pool", "")
  console.log('TO', )

   React.useMemo(async () => {
    if (!!signer) {
      const pairContract = new ethers.Contract(ethers.utils.getAddress(tokenAddress), IUniswapV2Pair["abi"], signer)
      const pairERC20Contract = new ethers.Contract(
        ethers.utils.getAddress(tokenAddress),
        UniswapV2ERC20["abi"],
        signer
      )
      console.log("to", token)

      console.log("token", tokenAddress)
      // console.log('contract', pairContract)
      // console.log('contract 2', pairERC20Contract)
      console.log("bbyDao", bbyDao)

      const totalSupply = await pairContract?.totalSupply()
      const reserves = await pairContract?.getReserves()
      const bbyDaoBalance = await pairERC20Contract?.balanceOf(bbyDao)
      const percentageOfPool =  NumberFromBig(bbyDaoBalance, pairToken?.decimals) / NumberFromBig(totalSupply, pairToken?.decimals)
      const bbyDaoAllowance = await pairERC20Contract?.allowance(bbyDao, UniswapV2Router02)

      console.log('tot', NumberFromBig(totalSupply, pairToken?.decimals))
      const totalPriceEth = NumberFromBig(totalSupply, pairToken?.decimals) * parseFloat(token.ethValue)
      console.log('pr', totalPriceEth)

      const reserve0 = reserves[0]
      const reserve1 = reserves[1]


      const token0 = await pairContract?.token0()
      const token1 = await pairContract?.token1()
      const price0 = await pairContract?.price0CumulativeLast()
      const price1 = await pairContract?.price1CumulativeLast()
      const token0Contract =  new ethers.Contract(ethers.utils.getAddress(tokenAddress), minimalABI, signer)
      const token1Contract =  new ethers.Contract(ethers.utils.getAddress(tokenAddress), minimalABI, signer)


      console.log('token0', token0Contract)


      // function getTokenPrice(pairAddress, amount) {
      //   pair = IUniswapV2Pair(pairAddress);
      //    token1 = IERC20(pair.token1);
      //   (Res0, Res1,) = pair.getReserves();
      //
      //   // decimals
      //   uint res0 = Res0*(10**token1.decimals());
      //   return((amount*res0)/Res1); // return amount of token0 needed to buy token1
      // }



      console.log('pr', price0.toString(), price1.toString())


      setBreakDown({
        ...breakDown,
        poolTokens: NumberFromBig(bbyDaoBalance, pairToken?.decimals),
        hasAllowance: parseFloat(amount(bbyDaoAllowance, pairToken?.decimals)) > 0,
        pairContract,
        percentageOfPool: `${((percentageOfPool * 100) < .01 ) ? '< 0.01' : parseFloat((percentageOfPool * 100).toString()).toFixed(6)}%`
      })

    }
  }, [tokenAddress, signer, bbyDao])


  useEffect(() => {
    if (!liquidity) setState({ liquidity: 0 })
  }, [])

  const handleApprovePair = async contract => {
    handleGnosisTransaction({
      contract: {
        abi: IUniswapV2Pair["abi"],
        instance: contract,
        args: {
          spender: UniswapV2Router02,
          value: BigNumber.from(max256),
        },
        fn: "approve(address,uint256)",
      },
      signer,
      bbyDao,
      to: contract?.address,
      value: 0,
    })
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
        <div>Amount of Tokens You will Receive back</div>
        <div>
          <div>Current Position</div>
          <div>{pairName}</div>
          <div>Your Total Pool Tokens: {breakDown?.poolTokens}</div>
          <div>Your Pool Share: {breakDown?.percentageOfPool}</div>

        </div>
        {console.log("brea", breakDown)}
      </div>

      {breakDown.hasAllowance === false && (
          <div
              className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
              onClick={() => handleApprovePair(breakDown?.pairContract)}
          >
            Approve {pairName} UNI-V2 LP Token
          </div>
      )}
    </div>
  )
}

export default RemoveLiquidity

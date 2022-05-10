import { ethers }         from "ethers"
import React, {useEffect} from "react"
import { useSigner }      from "wagmi"
import useForm from "hooks/useForm"

const RemoveLiquidity = ({ token }) => {
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const [{ data: signer }] = useSigner()
  const { state, setState, handleChange } = useForm()
  const { liquidity } = state

  useEffect(() => {
    if(!liquidity)
      setState({liquidity: 0})

  }, [])

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
        <div>
          Amount of Tokens You will Receive back
        </div>
        <div>
          Current Position
        </div>
      </div>

      {console.log("token", token)}
    </div>
  )
}

export default RemoveLiquidity

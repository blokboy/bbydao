import React, { useEffect } from "react"
import ToolTip from "../Layout/Tooltip"

const Slippage = ({ value, handleChange, setState, defaultSlippage }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  useEffect(() => {
    if (value < 0.1) {
      setState({ slippage: NaN })
    }
  }, [value])
  return (
    <div className="mt-6 flex">
      <div
        onClick={() => setIsOpen(bool => !bool)}
        className={`flex flex w-48 flex-col items-center rounded-xl border bg-slate-200 p-2 text-sm font-thin shadow-lg hover:cursor-pointer hover:border hover:border-[#FC8D4D] dark:border-slate-800 dark:bg-slate-800 hover:dark:border-[#FC8D4D] ${
          isOpen && "border-slate-600  bg-slate-300 dark:border-slate-400 dark:bg-slate-800"
        }`}
      >
        <div className="flex flex items-center">
          <div>Slippage Tolerance:</div>
          <div className="ml-2 text-xs italic">{value || defaultSlippage}%</div>
        </div>
        {isOpen && (
          <div className="my-2 flex h-8 items-center rounded-lg bg-slate-100 px-2 dark:bg-slate-700">
            <input
              value={value || ''}
              type="number"
              name="slippage"
              onChange={handleChange}
              className="w-full appearance-none bg-slate-100 text-sm leading-tight focus:outline-none dark:bg-slate-700"
              onClick={e => e.stopPropagation()}
              step={.01}
            />
            %
          </div>
        )}
      </div>
      <ToolTip>Your transaction will revert if the price changes unfavorably more than this percentage.</ToolTip>
    </div>
  )
}

export default Slippage

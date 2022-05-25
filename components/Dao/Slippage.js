import React from "react"
import ToolTip from "../Layout/ToolTip"

const Slippage = ({ value, handleChange, setState, defaultSlippage }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  React.useEffect(() => {
    if (value < 0) {
      setState(state => ({ ...state, slippage: NaN }))
    }

    if (value > 50) {
      setState(state => ({ ...state, slippage: 50 }))
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
              value={value || (value < 0 ? 0 : "")}
              type="number"
              name="slippage"
              onChange={handleChange}
              className="w-full appearance-none bg-slate-100 text-sm leading-tight focus:outline-none dark:bg-slate-700"
              onClick={e => e.stopPropagation()}
              onBlur={() => setIsOpen(false)}
              step={0.01}
              autoFocus={true}
              min="0"
              max="50"
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

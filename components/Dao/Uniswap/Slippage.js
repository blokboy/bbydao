import React from "react"
import ToolTip from "../../Layout/Tooltip"

const Slippage = ({ value, handleChange, defaultSlippage }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div className="mt-6 flex">
      <div
        onClick={() => setIsOpen(bool => !bool)}
        className={`flex flex w-48 shadow-lg flex-col items-center rounded-xl p-2 text-sm font-thin hover:cursor-pointer border hover:border-[#FC8D4D] hover:dark:border-[#FC8D4D] dark:border-slate-800 bg-slate-200 dark:bg-slate-800 hover:border ${
          isOpen && "bg-slate-300  border-slate-600 dark:bg-slate-800 dark:border-slate-400"
        }`}
      >
        <div className="flex flex items-center">
          <div>Slippage Tolerance:</div>
          <div className="ml-2 text-xs italic">{value || defaultSlippage}%</div>
        </div>
        {isOpen && (
          <div className="my-2 flex h-8 items-center rounded-lg bg-slate-100 px-2 dark:bg-slate-700">
            <input
              value={value}
              type="number"
              name="slippage"
              onChange={handleChange}
              className="w-full appearance-none bg-slate-100 text-sm leading-tight focus:outline-none dark:bg-slate-700"
              onClick={e => e.stopPropagation()}
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

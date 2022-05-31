import React from "react"
import { useDaoStore } from "../../stores/useDaoStore"
import ToolTip from "../Layout/ToolTip"

const Fee = () => {
  const toggleBbyDaoFee = useDaoStore(state => state.toggleBbyDaoFee)
  const setBbyDaoFee = useDaoStore(state => state.setBbyDaoFee)
  const bbyDaoFee = useDaoStore(state => state.bbyDaoFee)

  React.useEffect(() => {
    setBbyDaoFee(true)
  }, [])

  return (
    <div className="ml-auto flex items-center justify-center rounded-xl bg-slate-200 p-2 font-thin dark:bg-slate-800">
      <img src="/babydao.png" alt="bbydao" height={25} width={25} className={`${!bbyDaoFee ? "grayscale" : ""}`} />
      <div
        className={`flex h-4 w-4 items-center justify-center border hover:cursor-pointer ${
          bbyDaoFee ? "" : "hover:bg-white"
        }`}
        onClick={toggleBbyDaoFee}
      >
        {bbyDaoFee && <div className="flex h-2 w-2 bg-white p-1" />}
      </div>
      {bbyDaoFee ? (
        <ToolTip>Unchecking this box will waive the 1% bbyDAO transaction fee.</ToolTip>
      ) : (
        <ToolTip>Checking this box will add the 1% bbyDAO transaction fee.</ToolTip>
      )}
    </div>
  )
}

export default Fee

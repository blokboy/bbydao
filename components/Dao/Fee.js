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
      <img
        onClick={toggleBbyDaoFee}
        src="/babydao.png"
        alt="bbydao"
        height={25}
        width={25}
        className={`${!bbyDaoFee ? "grayscale" : ""} hover:cursor-pointer`}
      />
      {bbyDaoFee ? (
        <ToolTip>
          Click the bbyDAO logo (
          <img
            src="/babydao.png"
            alt="bbydao"
            height={15}
            width={15}
            className={`inline ${!bbyDaoFee ? "grayscale" : ""} hover:cursor-pointer`}
          />
          ) to waive the 1% bbyDAO transaction fee.
        </ToolTip>
      ) : (
        <ToolTip>
          The 1% bbyDAO fee has been waived. <em>Click the bbyDAO logo (
          <img
            src="/babydao.png"
            alt="bbydao"
            height={15}
            width={15}
            className={`inline ${!bbyDaoFee ? "grayscale" : ""} hover:cursor-pointer`}
          />
          ) to add this fee.{" "}</em>
        </ToolTip>
      )}
    </div>
  )
}

export default Fee

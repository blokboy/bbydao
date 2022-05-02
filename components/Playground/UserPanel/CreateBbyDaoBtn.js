import React from "react"

const CreateBbyDaoBtn = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <button
        className="flex w-28 flex-row items-center justify-center space-x-3 rounded-lg border border-green-300 bg-slate-200 p-1 dark:border-green-300 dark:bg-slate-800"
        disabled
      >
        <span>create bbyDAO</span>
      </button>
    </div>
  )
}

export default CreateBbyDaoBtn

import React from "react"
import { useUiStore } from 'stores/useUiStore';

const CreateBbyDaoBtn = () => {
  const setCreateDaoModalOpen = useUiStore(state => state.setCreateDaoModalOpen)
  
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <button
        className="flex w-36 flex-row rounded-lg bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
        onClick={setCreateDaoModalOpen}
      >
        <span
        className="flex w-full items-center justify-center rounded-lg bg-slate-200 font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75"
        >create bbyDAO</span>
      </button>
    </div>
  )
}

export default CreateBbyDaoBtn

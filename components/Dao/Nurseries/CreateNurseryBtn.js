import React from "react"

const CreateNurseryBtn = () => {
  return (
    <div className="mx-2 mb-3 flex flex-col items-center rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      <span className="text-md my-2">
        this bbyDAO is not a part of any nurseries.
      </span>
      <button className="w-1/2 rounded-lg bg-slate-300 p-3 font-bold shadow-xl hover:bg-slate-200 active:shadow-lg dark:bg-slate-800 dark:hover:hover:bg-slate-700">
        create nursery
      </button>
    </div>
  )
}

export default CreateNurseryBtn

import React from "react"

const CreateNurseryBtn = () => {
  return (
    <div className="mx-2 mb-3 flex flex-col rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      <div className="flex w-full flex-row justify-center p-3">
        <button className="w-1/2 rounded-lg bg-slate-300 p-3 font-bold shadow-xl active:shadow-lg dark:bg-slate-800">
          create nursery
        </button>
      </div>
    </div>
  )
}

export default CreateNurseryBtn

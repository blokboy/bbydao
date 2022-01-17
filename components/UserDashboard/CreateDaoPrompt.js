import React from "react"
import { useUiStore } from "stores/useUiStore"
import { MdAdd } from "react-icons/md"

const CreateDaoPrompt = () => {
  const setCreateDaoModalOpen = useUiStore(state => state.setCreateDaoModalOpen)

  return (
    <div className="flex flex-col w-full mt-10 items-center">
      <span className="font-bold text-2xl">
        you havent joined any daos yet.
      </span>
      <button
        className="flex flex-row mt-4 rounded-full shadow bg-slate-200 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-700 px-4 py-2 w-max"
        onClick={setCreateDaoModalOpen}
      >
        <span className="h-full pr-1 pt-1 text-slate-800 dark:text-white">
          <MdAdd />
        </span>
        <a>create</a>
      </button>
    </div>
  )
}

export default CreateDaoPrompt

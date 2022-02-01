import React from "react"
import { useUiStore } from "stores/useUiStore"
import { MdAdd } from "react-icons/md"

const CreateDaoButton = () => {
  const setCreateDaoModalOpen = useUiStore(state => state.setCreateDaoModalOpen)

  return (
    <button
      className="mt-4 flex w-max flex-row rounded-full bg-slate-200 px-4 py-2 shadow hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-700"
      onClick={setCreateDaoModalOpen}
    >
      <span className="h-full pr-1 pt-1 text-slate-800 dark:text-white">
        <MdAdd />
      </span>
      <a>create dao</a>
    </button>
  )
}

export default CreateDaoButton

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
        className="flex flex-row mt-4 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max"
        onClick={setCreateDaoModalOpen}
      >
        <span className="h-full pr-1 pt-1 text-gray-800 dark:text-white">
          <MdAdd />
        </span>
        <a>create</a>
      </button>
    </div>
  )
}

export default CreateDaoPrompt

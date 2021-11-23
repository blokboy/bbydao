import React from "react"
import { MdAdd } from "react-icons/md"

const CreateDaoPrompt = () => {
  return (
    <div className="flex flex-col w-full mt-10 items-center">
      <span className="font-bold text-2xl">
        you havent joined any daos yet.
      </span>
      <button className="w-max px-4 mt-6 py-2 flex flex-row justify-center rounded-full bg-gray-200 hover:bg-white dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-100">
        <span className="h-full pr-1 pt-1 text-gray-800 dark:text-white">
          <MdAdd />
        </span>
        create
      </button>
    </div>
  )
}

export default CreateDaoPrompt

import React from "react"
import { IoMdAddCircle } from "react-icons/io"

const ResultCard = () => {
  return (
    <div className="flex flex-row mb-3 rounded-lg bg-gray-50 dark:bg-gray-800 justify-between py-2 px-1 w-full">
      <span>result</span>
      <span className="mr-4">
        <IoMdAddCircle size={24} />
      </span>
    </div>
  )
}

export default ResultCard

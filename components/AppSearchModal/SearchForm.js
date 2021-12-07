import React from "react"
import { GoSearch } from "react-icons/go"

const SearchForm = () => {
  return (
    <div className="relative w-full py-3 border-b-2 text-gray-600 focus-within:text-gray-400 dark:focus-within:text-gray-100">
      <span className="absolute left-0 top-4 flex items-center pl-2">
        <GoSearch size={24} />
      </span>
      <input
        type="search"
        className="w-full py-2 text-sm text-white bg-gray-200 pl-10 focus:outline-none focus:text-gray-900 dark:bg-gray-900 dark:focus:text-gray-100"
        placeholder="Search..."
        autoComplete="off"
      />
    </div>
  )
}

export default SearchForm

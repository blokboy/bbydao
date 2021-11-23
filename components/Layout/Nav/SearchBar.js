import React from "react"
import { GoSearch } from "react-icons/go"

const SearchBar = ({ children }) => {
  return (
    <div className="relative w-full sm:w-4/5 md:w-3/5 mr-2 text-gray-600 focus-within:text-gray-400 dark:focus-within:text-gray-100">
      <span className="absolute left-0 top-1.5 flex items-center pl-2">
        <GoSearch size={24} />
      </span>
      <input
        type="search"
        className="w-full py-2 text-sm text-white bg-gray-200 rounded-full pl-10 focus:outline-none focus:bg-white focus:text-gray-900 dark:bg-gray-900 dark:focus:text-gray-100"
        placeholder="Search..."
        autoComplete="off"
      >
        {children}
      </input>
    </div>
  )
}

export default SearchBar

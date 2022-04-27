import React from "react"
import { GoSearch } from "react-icons/go"
import { useLayoutStore } from "stores/useLayoutStore"

const SearchIcon = () => {
  const setSearchOpen = useLayoutStore(state => state.setSearchOpen)

  return (
    <div className="flex-row items-center justify-center md:flex">
      <button className="nav-btn" onClick={setSearchOpen}>
        <GoSearch />
      </button>
    </div>
  )
}

export default SearchIcon

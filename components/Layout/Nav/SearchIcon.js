import React from "react"
import { GoSearch } from "react-icons/go"
import { useUiStore } from "stores/useUiStore"

const SearchIcon = () => {
  const setAppModalOpen = useUiStore(state => state.setAppModalOpen)

  return (
    <div className="mr-3 flex-row items-center justify-center md:flex">
      <button className="nav-btn" onClick={setAppModalOpen}>
        <GoSearch />
      </button>
    </div>
  )
}

export default SearchIcon

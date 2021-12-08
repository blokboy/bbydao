import React from "react"
import { GoSearch } from "react-icons/go"
import { useUiStore } from "../../stores/useUiStore"

const SearchForm = () => {
  const modalOpen = useUiStore(state => state.setModalOpen)
  const setModalOpen = useUiStore(state => state.setModalOpen)

  const handleKeyDown = event => {
    if (event.keyCode === 27) {
      if (modalOpen) {
        setModalOpen()
      }
      return
    }
  }

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <div className="relative w-full py-3 border-b-2 text-gray-600 focus-within:text-gray-400 dark:focus-within:text-gray-100">
      <span className="absolute left-0 top-4 flex items-center pl-2">
        <GoSearch size={24} />
      </span>
      <input
        autoFocus
        className="w-full py-2 text-sm text-white bg-gray-200 pl-12 focus:outline-none focus:text-gray-900 dark:bg-gray-900 dark:focus:text-gray-100"
        placeholder="Search..."
        autoComplete="off"
      />
      <button
        className="absolute right-2 top-3 rounded-lg border dark:text-white px-2 py-1"
        onClick={setModalOpen}
      >
        esc
      </button>
    </div>
  )
}

export default SearchForm

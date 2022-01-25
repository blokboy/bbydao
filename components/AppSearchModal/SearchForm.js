import React from "react"
import { GoSearch } from "react-icons/go"
import { useUiStore } from "stores/useUiStore"

const SearchForm = () => {
  const appModalOpen = useUiStore(state => state.setAppModalOpen)
  const setAppModalOpen = useUiStore(state => state.setAppModalOpen)

  const handleKeyDown = event => {
    if (event.keyCode === 27) {
      if (appModalOpen) {
        setAppModalOpen()
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
    <div className="relative w-full border-b-2 border-slate-300 py-3 text-slate-600 focus-within:text-slate-400 dark:focus-within:text-slate-100">
      <span className="absolute left-0 top-4 flex items-center pl-2">
        <GoSearch size={24} />
      </span>
      <input
        autoFocus
        className="w-full bg-slate-200 py-2 pl-12 text-sm text-white focus:text-slate-900 focus:outline-none dark:bg-slate-900 dark:focus:text-slate-100"
        placeholder="Search..."
        autoComplete="off"
      />
      <button
        className="absolute right-2 top-3 rounded-lg border px-2 py-1 dark:text-white"
        onClick={setAppModalOpen}
      >
        esc
      </button>
    </div>
  )
}

export default SearchForm

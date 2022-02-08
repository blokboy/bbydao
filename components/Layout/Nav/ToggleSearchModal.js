import React from "react"
import { GoSearch } from "react-icons/go"
import { useUiStore } from "stores/useUiStore"

const ToggleSearchModal = () => {
  const appModalOpen = useUiStore(state => state.appModalOpen)
  const setAppModalOpen = useUiStore(state => state.setAppModalOpen)

  const handleKeyDown = event => {
    if (!appModalOpen && event.keyCode === 75 && event.metaKey) {
      setAppModalOpen()
    }
    return
  }

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <button
      className="hidden transform flex-row rounded-full border border-slate-400 bg-slate-100 px-4 py-2 shadow transition duration-200 ease-in-out hover:-translate-x-0.5 hover:border-[#3cffb45d] hover:shadow-[#0db2ac93] dark:bg-slate-900 dark:hover:bg-slate-800 md:flex md:w-96"
      onClick={setAppModalOpen}
    >
      <span className="mr-4">
        <GoSearch size={24} />
      </span>
      <span>Search</span>
      <span className="ml-3 rounded-lg border px-2 text-sm dark:text-white">
        &#8984; K
      </span>
    </button>
  )
}

export default ToggleSearchModal

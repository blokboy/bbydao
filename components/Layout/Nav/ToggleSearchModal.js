import React from "react"
import { GoSearch } from "react-icons/go"
import { useUiStore } from "stores/useUiStore"

const ToggleSearchModal = () => {
  const modalOpen = useUiStore(state => state.modalOpen)
  const setModalOpen = useUiStore(state => state.setModalOpen)

  const handleKeyDown = event => {
    if (!modalOpen && event.keyCode === 75 && event.metaKey) {
      setModalOpen()
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
      className="flex flex-row rounded-full border border-gray-400 shadow bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 px-4 py-2 md:w-96 w-max"
      onClick={setModalOpen}
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

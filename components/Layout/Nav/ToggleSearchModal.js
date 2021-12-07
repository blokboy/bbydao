import React from "react"
import { useAppModalStore } from "../../../stores/useAppModalStore"

const ToggleSearchModal = () => {
  const modalOpen = useAppModalStore(state => state.modalOpen)
  const setModalOpen = useAppModalStore(state => state.setModalOpen)

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
  }, [])

  return (
    <button
      className="hidden md:flex flex-row mr-3 rounded-lg border border-gray-400 shadow bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 px-4 py-2 w-max"
      onClick={setModalOpen}
    >
      Search
      <span className="ml-3 rounded-lg border text-sm dark:text-white px-2">
        &#8984; K
      </span>
    </button>
  )
}

export default ToggleSearchModal

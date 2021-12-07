import React from "react"
import { useAppModalStore } from "../../../stores/useAppModalStore"

const ToggleSearchModal = () => {
  const setModalOpen = useAppModalStore(state => state.setModalOpen)

  return (
    <button
      className="hidden md:flex flex-row mr-3 rounded-full border border-gray-400 shadow bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 px-4 py-2 w-max"
      onClick={setModalOpen}
    >
      Search
    </button>
  )
}

export default ToggleSearchModal

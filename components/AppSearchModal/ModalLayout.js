import React from "react"
import SearchForm from "./SearchForm"
import ResultsDropdown from "./ResultsDropdown"
import { useAppModalStore } from "../../stores/useAppModalStore"

const ModalLayout = () => {
  const modalOpen = useAppModalStore(state => state.modalOpen)
  const setModalOpen = useAppModalStore(state => state.setModalOpen)

  const closeModal = e => {
    if (!modalOpen && e.target) {
      return
    }
    setModalOpen()
  }

  return (
    <>
      {modalOpen ? (
        <div
          className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          onClick={e => closeModal(e)}
        >
          <div
            className="flex flex-col z-50 mt-16 mx-auto rounded-xl shadow bg-gray-200 dark:bg-gray-900 px-4 py-2 w-11/12 md:w-6/12"
            onClick={e => closeModal(e)}
          >
            <SearchForm />
            <ResultsDropdown />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default ModalLayout

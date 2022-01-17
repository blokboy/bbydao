import React from "react"
import SearchForm from "./SearchForm"
import ResultsDropdown from "./ResultsDropdown"
import { useUiStore } from "stores/useUiStore"

const ModalLayout = () => {
  const appModalOpen = useUiStore(state => state.appModalOpen)
  const setAppModalOpen = useUiStore(state => state.setAppModalOpen)

  const closeModal = e => {
    if (!appModalOpen && e.target) {
      return
    }
    setAppModalOpen()
  }

  return (
    <>
      {appModalOpen ? (
        <div
          className="fixed z-40 inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full"
          onClick={e => closeModal(e)}
        >
          <div
            className="flex flex-col z-50 mt-24 mx-auto rounded-xl shadow bg-slate-200 dark:bg-slate-900 px-4 py-2 w-11/12 md:w-6/12"
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

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
          className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
          onClick={e => closeModal(e)}
        >
          <div
            className="z-50 mx-auto mt-24 flex w-11/12 flex-col rounded-xl bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:w-6/12"
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

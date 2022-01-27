import React from "react"
import AppSearch from "./AppSearch"
import { useUiStore } from "stores/useUiStore"

const AppSearchModal = () => {
  const appModalOpen = useUiStore(state => state.appModalOpen)
  const setAppModalOpen = useUiStore(state => state.setAppModalOpen)

  const closeModal = e => {
    if (!appModalOpen && e.target) {
      return
    }
    setAppModalOpen()
  }

  if (!appModalOpen) return <></>

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      <AppSearch />
    </div>
  )
}

export default AppSearchModal

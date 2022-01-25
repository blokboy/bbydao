import React from "react"
import { useDaoStore } from "../../../stores/useDaoStore"
import OsSearchBar from "./osSearchBar"

const OpenSeaSearch = () => {
  const openSeaModalOpen = useDaoStore(state => state.openSeaModalOpen)
  const setOpenSeaModalOpen = useDaoStore(state => state.setOpenSeaModalOpen)

  const closeModal = e => {
    if (!openSeaModalOpen && e.target) {
      return
    }
    setOpenSeaModalOpen()
  }

  if (!openSeaModalOpen) return <></>

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      <OsSearchBar />
    </div>
  )
}

export default OpenSeaSearch

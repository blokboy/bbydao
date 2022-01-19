import React from "react"
import { useDaoStore } from "../../../stores/useDaoStore"
import OsSearchBar from "./osSearchBar"
import OsResults from "./OsResults"

const OpenSeaSearch = () => {
  const openSeaModalOpen = useDaoStore(state => state.openSeaModalOpen)
  const setOpenSeaModalOpen = useDaoStore(state => state.setOpenSeaModalOpen)

  const closeModal = e => {
    if (!openSeaModalOpen && e.target) {
      return
    }
    // setState({})
    setOpenSeaModalOpen()
  }

  if (!openSeaModalOpen) return <></>

  return (
    <div
      className="fixed z-40 inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={e => closeModal(e)}
    >
      <OsSearchBar />
    </div>
  )
}

export default OpenSeaSearch

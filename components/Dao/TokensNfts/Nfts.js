import React from "react"
import { useDaoStore } from "stores/useDaoStore"

const Nfts = ({ collectibles }) => {
  console.log("Nfts", collectibles)
  const setOpenSeaModalOpen = useDaoStore(state => state.setOpenSeaModalOpen)

  return (
    <div>
      <h1>Collectibles: {collectibles.length}</h1>

      <div className="w-full text-center">
        <button
          className="mb-4 w-2/4 rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow hover:bg-gradient-to-l"
          onClick={setOpenSeaModalOpen}
        >
          <span className="block rounded-full bg-slate-200 px-8 py-3 font-medium text-black hover:bg-opacity-50 dark:bg-slate-900 dark:text-white dark:hover:bg-opacity-75">
            search open sea
          </span>
        </button>
      </div>
    </div>
  )
}

export default Nfts

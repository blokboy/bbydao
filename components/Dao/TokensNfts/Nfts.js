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
          className="shadow p-0.5 rounded-full bg-gradient-to-r hover:bg-gradient-to-l from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] mb-4 w-2/4"
          onClick={setOpenSeaModalOpen}
        >
          <span className="block px-8 py-3 font-medium text-black dark:text-white bg-slate-200 dark:bg-slate-900 rounded-full hover:bg-opacity-50 dark:hover:bg-opacity-75">
            search open sea
          </span>
        </button>
      </div>
    </div>
  )
}

export default Nfts

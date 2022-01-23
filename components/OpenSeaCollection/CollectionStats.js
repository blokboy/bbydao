import React from "react"

const CollectionStats = ({ floor, avg, volume }) => {
  return (
    <div className="flex flex-col w-full border border-white rounded-xl p-3 mt-4">
      <span>floor:{floor}</span>
      <span>avg:{avg}</span>
      <span>volume:{volume}</span>
    </div>
  )
}

export default CollectionStats

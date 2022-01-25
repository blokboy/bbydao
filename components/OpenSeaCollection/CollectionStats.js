import React from "react"

const CollectionStats = ({ floor, avg, volume }) => {
  return (
    <div className="mt-4 flex w-full flex-col rounded-xl border border-white p-3">
      <span>floor:{floor}</span>
      <span>avg:{avg}</span>
      <span>volume:{volume}</span>
    </div>
  )
}

export default CollectionStats

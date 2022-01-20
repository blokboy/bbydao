import React from "react"

const CollectionInfo = ({ name }) => {
  return (
    <div className="flex flex-col border border-white rounded-xl p-3">
      <h1 className="flex text-6xl w-full justify-center">{name}</h1>
      collection info
    </div>
  )
}

export default CollectionInfo

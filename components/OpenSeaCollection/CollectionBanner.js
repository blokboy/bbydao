import React from "react"

const CollectionBanner = ({ banner }) => {
  return (
    <div className="flex flex-row place-self-center justify-around">
      <div className="block w-full h-72 overflow-hidden">
        <img className="p-3" src={banner} alt="" />
      </div>
    </div>
  )
}

export default CollectionBanner

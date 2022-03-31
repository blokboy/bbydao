import React from "react"

const CollectionBanner = ({ banner }) => {
  return (
    <div className="flex flex-row">
      <div className="block h-72 w-full overflow-hidden">
        <img className="w-screen h-full object-contain md:h-auto" src={banner} alt="" />
      </div>
    </div>
  )
}

export default CollectionBanner

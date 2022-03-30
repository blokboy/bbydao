import React from "react"

const SidePanel = () => {
  return (
    <div className="flex-start mx-1 mb-3 flex h-full flex-col px-4 md:flex-col">
      <div className="mb-3 flex place-content-center">
        <div className="h-28 w-28 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
      </div>

      <div className="flex flex-col items-center md:items-start">
        <h1 className="">nursery address</h1>
      </div>
    </div>
  )
}

export default SidePanel

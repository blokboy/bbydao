import React from "react"
import NurseryCard from "./NurseryCard"

const NurseryList = ({ nurseries }) => {
  return (
    <div className="mx-2 mb-3 flex flex-col rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      <h1>Nursery List</h1>
      <div className="m-2 flex flex-col rounded-xl bg-slate-300 p-2 shadow-xl dark:bg-slate-800">
        <NurseryCard />
        <NurseryCard />
        <NurseryCard />
      </div>
    </div>
  )
}

export default NurseryList

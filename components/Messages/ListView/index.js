import React from "react"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"

const ListView = ({ threads }) => {
  return (
    <div className="md:w-50 h-full w-full bg-slate-100 p-2 shadow-xl dark:bg-slate-900">
      <ListToolbar />
      <ListContent threads={threads} />
    </div>
  )
}

export default ListView

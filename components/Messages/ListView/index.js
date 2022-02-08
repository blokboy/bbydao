import React from "react"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"

const ListView = ({ threads }) => {
  return (
    <div className="h-5/6 bg-slate-100 p-2 shadow-xl dark:bg-slate-900 md:w-[20%]">
      <ListToolbar />
      <ListContent threads={threads}/>
    </div>
  )
}

export default ListView

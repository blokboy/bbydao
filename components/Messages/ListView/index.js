import React from "react"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"

const ListView = () => {
  return (
    <div className="h-5/6 bg-slate-100 p-2 shadow-xl dark:bg-slate-900 md:w-[20%]">
      <ListToolbar />
      <ListContent />
    </div>
  )
}

export default ListView

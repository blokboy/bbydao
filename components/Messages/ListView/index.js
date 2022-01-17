import React from "react"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"

const ListView = () => {
  return (
    <div className="shadow-xl md:w-[20%] h-5/6 bg-slate-100 dark:bg-slate-900 p-2">
      <ListToolbar />
      <ListContent />
    </div>
  )
}

export default ListView

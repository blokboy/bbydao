import React from "react"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"

const ListView = () => {
  return (
    <div className="shadow-xl w-full h-5/6 md:w-3/6 md:rounded-xl bg-gray-100 dark:bg-gray-900 p-2">
      <ListToolbar />
      <ListContent />
    </div>
  )
}

export default ListView

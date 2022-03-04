import React from "react"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"

const ListView = ({ threads }) => {
  return (
    <div className="h-full w-full p-3">
      <ListContent threads={threads} />
    </div>
  )
}

export default ListView

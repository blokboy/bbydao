import React from "react"
import ListToolbar from "./ListToolbar"
import ListContent from "./ListContent"

const ListView = ({ threads }) => {
  return (
    <div className="h-full w-full md:w-1/3">
      <ListToolbar />
      <ListContent threads={threads} />
    </div>
  )
}

export default ListView

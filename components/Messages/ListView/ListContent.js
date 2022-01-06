import React from "react"
import ListViewCard from "./ListViewCard"

const ListContent = () => {
  return (
    <div className="overflow-auto rounded-xl bg-gray-50 dark:bg-gray-800 h-[90%] p-3">
      <ListViewCard />
      <ListViewCard />
      <ListViewCard />
      <ListViewCard />
      <ListViewCard />
      <ListViewCard />
      <ListViewCard />
      <ListViewCard />
    </div>
  )
}

export default ListContent

import React from "react"
import ListViewCard from "./ListViewCard"

const ListContent = () => {
  return (
    <div className="h-[90%] overflow-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
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

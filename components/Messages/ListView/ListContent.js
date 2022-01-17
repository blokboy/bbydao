import React from "react"
import ListViewCard from "./ListViewCard"

const ListContent = () => {
  return (
    <div className="overflow-auto rounded-xl bg-slate-50 dark:bg-slate-800 h-[90%] p-3">
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

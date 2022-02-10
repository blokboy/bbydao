import React from "react"
import ListViewCard from "./ListViewCard"

const ListContent = ({ threads }) => {
  const messages = []
  for (const [key, values] of Object.entries(threads.threads)) {
    messages.push([key, values])
  }

  return (
    <div className="h-[90%] overflow-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
      {messages.map((thread, i) => {
        return <ListViewCard key={i} title={thread[0]} thread={thread[1]} />
      })}
    </div>
  )
}

export default ListContent

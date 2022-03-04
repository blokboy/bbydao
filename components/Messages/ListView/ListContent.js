import React from "react"
import ListToolbar from "./ListToolbar"
import ListViewCard from "./ListViewCard"

const ListContent = ({ threads }) => {
  console.log(threads)
  const messages = []
  for (const [key, values] of Object.entries(threads.threads)) {
    messages.push([key, values])
  }

  return (
    <div className="h-[95%] overflow-scroll p-3">
      {messages.map((thread, i) => {
        return <ListViewCard key={i} title={thread[0]} thread={thread[1]} />
      })}
    </div>
  )
}

export default ListContent

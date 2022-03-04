import React from "react"
import ListToolbar from "./ListToolbar"
import ListViewCard from "./ListViewCard"
import { useMessageStore } from "stores/useMessageStore"

const ListContent = ({ threads }) => {
  const daoListView = useMessageStore(state => state.daoListView)

  const messages = []
  for (const [key, values] of Object.entries(threads.threads)) {
    messages.push([key, values])
  }

  if (daoListView) {
    return <div className="h-[95%] overflow-scroll p-3">dao view</div>
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

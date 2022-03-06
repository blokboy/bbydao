import React from "react"
import ListToolbar from "./ListToolbar"
import ListViewCard from "./ListViewCard"
import { useMessageStore } from "stores/useMessageStore"

const ListContent = ({ threads, safes }) => {
  const daoListView = useMessageStore(state => state.daoListView)

  // list all users safes as well as their address to represent inboxes
  // populate daoListView with these
  // on click of an address - set channelAddress on useMessageStore to that address

  console.log("safes", safes)

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

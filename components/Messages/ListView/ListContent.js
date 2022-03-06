import React from "react"
import UserInboxCard from "./UserInboxCard"
import DaoInboxCard from "./DaoInboxCard"
import ListViewCard from "./ListViewCard"
import { useMessageStore } from "stores/useMessageStore"

const ListContent = ({ threads, safes, address }) => {
  const daoListView = useMessageStore(state => state.daoListView)

  // list all users safes as well as their address to represent inboxes
  // populate daoListView with these
  // on click of an address - set channelAddress on useMessageStore to that address

  const messages = []
  for (const [key, values] of Object.entries(threads.threads)) {
    messages.push([key, values])
  }

  if (daoListView) {
    return (
      <div className="h-[95%] overflow-scroll p-3">
        <UserInboxCard address={address} />
        {safes?.map((safe, i) => {
          return <DaoInboxCard key={i} safe={safe} />
        })}
      </div>
    )
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

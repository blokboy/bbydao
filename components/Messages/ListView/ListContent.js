import React from "react"
import UserInboxCard from "./UserInboxCard"
import DaoInboxCard from "./DaoInboxCard"
import ListViewCard from "./ListViewCard"
import { useMessageStore } from "stores/useMessageStore"

const ListContent = ({ threads, safes }) => {
  const inboxListView = useMessageStore(state => state.inboxListView)
  const setInboxListView = useMessageStore(state => state.setInboxListView)

  const setInboxView = () => {
    setInboxListView(true)
  }

  const messages = []
  if (threads) {
    for (const [key, values] of Object.entries(threads)) {
      messages.push([key, values])
    }
  }

  if (inboxListView) {
    return (
      <div className="h-[95%] overflow-scroll p-3">
        <UserInboxCard setInboxView={setInboxView} />
        {safes?.map((safe, i) => {
          return (
            <DaoInboxCard key={i} safe={safe} setInboxView={setInboxView} />
          )
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

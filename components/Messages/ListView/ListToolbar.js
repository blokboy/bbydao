import React from "react"
import { useMessageStore } from "stores/useMessageStore"

const ListToolbar = () => {
  const inboxListView = useMessageStore(state => state.inboxListView)
  const setInboxListView = useMessageStore(state => state.setInboxListView)

  return (
    <div className="flex w-full md:h-[5%]">
      <div className="flex w-full items-center justify-center">
        <button
          className={
            "mx-1 rounded-lg bg-slate-300 p-3 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700" +
            (inboxListView ? " text-blue-500" : "")
          }
          onClick={inboxListView ? null : setInboxListView}
        >
          Inboxes
        </button>
        <button
          className={
            "mx-1 rounded-lg bg-slate-300 p-3 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700" +
            (!inboxListView ? " text-blue-500" : "")
          }
          onClick={!inboxListView ? null : setInboxListView}
        >
          Channel Inbox
        </button>
      </div>
    </div>
  )
}

export default ListToolbar

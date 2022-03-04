import React from "react"
import { useMessageStore } from "stores/useMessageStore"

const ListToolbar = () => {
  const daoListView = useMessageStore(state => state.daoListView)
  const setDaoListView = useMessageStore(state => state.setDaoListView)

  return (
    <div className="flex h-[5%] w-full">
      <div className="flex w-full items-center justify-center">
        <button
          className={
            "mx-1 rounded-lg bg-slate-300 p-3 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700" +
            (daoListView ? " text-blue-500" : "")
          }
          onClick={daoListView ? null : setDaoListView}
        >
          dao view
        </button>
        <button
          className={
            "mx-1 rounded-lg bg-slate-300 p-3 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700" +
            (!daoListView ? " text-blue-500" : "")
          }
          onClick={!daoListView ? null : setDaoListView}
        >
          user view
        </button>
      </div>
    </div>
  )
}

export default ListToolbar

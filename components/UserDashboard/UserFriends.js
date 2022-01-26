import React from "react"
import * as api from "query"
import { useQuery } from "react-query"

const UserFriends = ({ id }) => {
  // fetch using address instead of id ?
  const { data } = useQuery(
    "friends",
    () => api.getFriends({ initiatorId: id, targetId: id }),
    { refetchOnWindowFocus: false }
    // { onSettled: data => console.log("settled UserFriends data", data) }
  )

  console.log("UserFriends data:", data)

  return (
    <div className="my-2 flex flex-col items-center md:items-start">
      <span>
        {data?.length} {data?.length === 1 ? "friend" : "friends"}
      </span>
      <div className="mt-4 flex flex-row">
        <div className="h-12 w-12 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
        <div className="-ml-3 h-12 w-12 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
        <div className="-ml-3 h-12 w-12 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
        <div className="-ml-3 h-12 w-12 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
      </div>
      <button className="mt-4">view all</button>
    </div>
  )
}

export default UserFriends

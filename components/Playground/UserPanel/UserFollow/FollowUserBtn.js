import React from "react"
import { BiUserPlus } from "react-icons/bi"
import { BiUserCheck } from "react-icons/bi"

import * as api from "/query"
import { useMutation, useQueryClient } from "react-query"

const FollowUserBtn = ({ user, address, friendStatus }) => {
  // request follow relationship with reqRelationship
  // follow enum is 4
  // once request is sent (onSuccess), invalidate cached data and refetch
  const queryClient = useQueryClient()
  const {status, mutateAsync} = useMutation(api.reqRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["friends", address], {
        refetchActive: true,
      })
    },
  })
  const handleFollow = () => {
    if (!address || !user) return
    const req = {
      initiator: user,
      target: address,
      status: 4,
    }
    mutateAsync(req)
  }

  if (friendStatus?.isFollowing) {
    return (
      <button className="flex w-28 flex-row items-center justify-center space-x-3 rounded-lg border border-green-300 bg-slate-200 p-1 dark:border-green-300 dark:bg-slate-800" disabled>
        <BiUserCheck size={18} />
        <span>following</span>
      </button>
    )
  }

  return (
    <button 
    className="flex w-28 flex-row items-center justify-center space-x-3 rounded-lg border bg-slate-200 p-1 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-teal-300 dark:hover:bg-slate-700"
    onClick={handleFollow}
    >
      <BiUserPlus size={18} />
      <span>follow</span>
    </button>
  )
}

export default FollowUserBtn

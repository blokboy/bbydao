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
  const {status, mutateAsync: follow} = useMutation(api.reqRelationship, {
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
    follow(req)
  }

  const {mutateAsync: unfollow} = useMutation(api.updateRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["friends", address], {
        refetchActive: true,
      })
    },
  })
  const handleUnfollow = () => {
    if (!address || !user) return
    const req = {
      id: friendStatus?.data?.id,
      initiator: user,
      target: address,
      status: 0,
    }
    unfollow(req)
  }

  if (friendStatus?.isFollowing) {
    return (
      <button 
      className="flex w-36 flex-row items-center justify-center space-x-3 rounded-lg border border-slate-200 bg-slate-200 p-1 dark:border-slate-800 dark:bg-slate-800 hover:dark:bg-slate-700 hover:dark:border-red-300 hover:border-red-300"
      onClick={handleUnfollow}
      >
        <BiUserCheck size={18} />
        <span>unfollow</span>
      </button>
    )
  }

  return (
    <button 
    className="flex w-36 flex-row items-center justify-center space-x-3 rounded-lg border bg-slate-200 p-1 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-teal-300 dark:hover:bg-slate-700"
    onClick={handleFollow}
    >
      <BiUserPlus size={18} />
      <span>follow</span>
    </button>
  )
}

export default FollowUserBtn

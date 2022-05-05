import React from "react"
import { BiUserPlus, BiUserCheck, BiUserX } from "react-icons/bi"
import * as api from "/query"
import { useMutation, useQueryClient } from "react-query"
import ClickAwayListener from "react-click-away-listener"

const FollowUserBtn = ({ user, address, friendStatus }) => {
  // request follow relationship with reqRelationship
  // follow enum is 4
  // once request is sent (onSuccess), invalidate cached data and refetch
  const queryClient = useQueryClient()
  const { status, mutateAsync: follow } = useMutation(api.reqRelationship, {
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

  const { mutateAsync: unfollow } = useMutation(api.updateRelationship, {
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

  const [unfollowDisplay, setUnfollowDisplay] = React.useState(false)

  const unfollowDisplayCallback = React.useCallback(() => {
    setUnfollowDisplay(true)
  }, [])

  const handleClickAway = React.useCallback(() => {
    if (unfollowDisplay) {
      setUnfollowDisplay(false)
    }
  }, [unfollowDisplay])

  const unfollowDropdown = React.useMemo(() => {
    return unfollowDisplay ? (
      <div className="absolute w-36 translate-y-2 rounded-lg border border-red-600 bg-slate-200 p-1.5 text-xs text-red-600 dark:border-red-300 dark:bg-slate-800 dark:text-red-300">
        <button
          className="flex flex-row space-x-1 rounded-lg border bg-slate-200 p-2 text-xs hover:border-red-300 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-red-300 dark:hover:bg-slate-700"
          onClick={handleUnfollow}
        >
          <BiUserX size={16} />
          Unfollow
        </button>
      </div>
    ) : null
  }, [unfollowDisplay])

  if (friendStatus?.isFollowing) {
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <button
            className="flex w-36 flex-row items-center justify-center space-x-3 rounded-lg border border-slate-200 bg-slate-200 p-1 hover:border-red-300 dark:border-slate-800 dark:bg-slate-800 hover:dark:border-red-300 hover:dark:bg-slate-700"
            onClick={unfollowDisplayCallback}
          >
            <BiUserCheck size={18} />
            <span>following</span>
          </button>
          {unfollowDropdown}
        </div>
      </ClickAwayListener>
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

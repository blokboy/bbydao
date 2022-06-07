import React from "react"
import { BiUserPlus, BiUserCheck, BiUserX } from "react-icons/bi"
import * as api                                from "/query"
import {useMutation, useQuery, useQueryClient} from "react-query"
import ClickAwayListener                       from "react-click-away-listener"

const FollowUserBtn = ({ user, address, isFollowing }) => {
  // request follow relationship with reqRelationship
  // user to user follow status is 2
  // onSuccess, invalidate cached data and refetch
  const queryClient = useQueryClient()

  const { status, mutateAsync: follow } = useMutation(api.reqRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["userFollowers", address], {
        refetchActive: true,
      })
    },
  })

  // getting signed in user data from react-query cache in order to pass the initiatorEns to the mutation
  const signedUser = queryClient.getQueryData(["signedUser", user])

  const handleFollow = () => {
    if (!address || !user) return
    const req = {
      initiator: signedUser?.address || user,
      initiatorEns: signedUser?.ens,
      target: address,
      status: 2,
    }
    console.log('follow req', req)
    follow(req)
  }

  // unfollow logic
  // onSuccess, invalidate cached data and refetch
  const { mutateAsync: unfollow } = useMutation(api.deleteRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["userFollowers", address], {
        refetchActive: true,
      })
    },
  })

  const handleUnfollow = () => {
    if (!address || !user) return
    const req = {
      id: isFollowing
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
          className="flex flex-row w-full space-x-1 rounded-lg border bg-slate-200 p-2 text-xs hover:border-red-300 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-red-300 dark:hover:bg-slate-700"
          onClick={handleUnfollow}
        >
          <BiUserX size={16} />
          Unfollow
        </button>
      </div>
    ) : null
  }, [unfollowDisplay])

  if (isFollowing) {
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

<<<<<<< HEAD
import React from 'react'
import { HiStar, HiCheckCircle } from 'react-icons/hi'
import { RiUserFollowLine } from 'react-icons/ri'
import { useMutation, useQueryClient } from "react-query"

import useFriendData from "hooks/useFriendData"
import * as api from "/query"
import { useDaoStore } from "stores/useDaoStore"
import FollowDaoModal from 'components/Dao/FollowDaoModal'


const DaoUtilityBar = ({ user, isMember, address }) => {
=======
import React from "react"
import { HiStar } from "react-icons/hi"
import { RiUserFollowLine } from "react-icons/ri"

const DaoUtilityBar = ({ isMember }) => {
>>>>>>> main
  // currently rendering these in an activated state
  // fill should be neautral, then colorful when following or favorited
  const [friendData, { friendStatus }] = useFriendData(address)

  const setFollowModalOpen = useDaoStore(
    state => state.setFollowModalOpen
  )
  
  const followModalOpen = useDaoStore(
    state => state.followModalOpen
  )

  const isFollowing = friendStatus?.isFollowing
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

  //check if user is a part of dao or following it
  // if not, give ability to follow 
  // if so, show the green check
  return (
<<<<<<< HEAD
    <div className="w-full h-0 flex flex-row space-x-1 items-end justify-end">
      <button className="flex -transform-y-6 h-6 w-6 items-center justify-center rounded-full border text-blue-700 dark:text-blue-300 border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600"
              onClick={setFollowModalOpen}
              title='Follow bbyDAO as a bbyDAO'
      >
        <RiUserFollowLine />
      </button>

      {
        isMember || isFollowing ? 
          <button className="flex -transform-y-6 h-6 w-6 items-center justify-center rounded-full border text-green-300 border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600"
                  title='Following as user'
          >
            <HiCheckCircle />
          </button> :
          <button className="flex -transform-y-6 h-6 w-6 items-center justify-center rounded-full border text-orange-300 border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600"
                  onClick={handleFollow}
                  title='Follow bbyDAO as a user'
          >
            <HiStar />
          </button>
    
      }

      {followModalOpen && (
        <FollowDaoModal user={user} targetDao={address} />
      )}    
=======
    <div className="flex h-0 w-full flex-row items-end justify-end space-x-1">
      {isMember ? (
        <button className="-transform-y-6 flex h-6 w-auto items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-xs shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600">
          create nursery
        </button>
      ) : (
        <React.Fragment>
          <button className="-transform-y-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-blue-700 shadow hover:bg-slate-100 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-600">
            <RiUserFollowLine />
          </button>
          <button className="-transform-y-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-orange-300 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600">
            <HiStar />
          </button>
        </React.Fragment>
      )}
>>>>>>> main
    </div>
  )
}

export default DaoUtilityBar

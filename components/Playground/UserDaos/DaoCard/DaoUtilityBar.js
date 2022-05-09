import React from 'react'
import { HiStar, HiCheckCircle } from 'react-icons/hi'
import { RiUserFollowLine } from 'react-icons/ri'
import { useMutation, useQueryClient } from "react-query"

import useFriendData from "hooks/useFriendData"
import * as api from "/query"
import { useDaoStore } from "stores/useDaoStore"
import FollowDaoModal from 'components/Dao/FollowDaoModal'


const DaoUtilityBar = ({ user, isMember, address }) => {
  // currently rendering these in an activated state
  // fill should be neautral, then colorful when following or favorited
  const [friendData, { friendStatus }] = useFriendData(address)

  const setFollowModalOpen = useDaoStore(
    state => state.setFollowModalOpen
  )

  const setTarget = useDaoStore(
    state => state.setFollowDaoModalTarget
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

  const handleFollowDao = () => {
    setTarget(address);
    setFollowModalOpen();
  }

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
    <div className="w-full h-0 flex flex-row space-x-1 items-end justify-end">

    { isMember ? (
        <button className="-transform-y-6 flex h-6 w-auto items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-xs shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600">
          create nursery
        </button>
      ):(
        <React.Fragment>
        <button className="flex -transform-y-6 h-6 w-6 items-center justify-center rounded-full border text-blue-700 dark:text-blue-300 border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600"
                onClick={handleFollowDao}
                title='Follow bbyDAO as a bbyDAO'
        >
          <RiUserFollowLine />
        </button>

        {
            isFollowing ? 
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
        </React.Fragment>
      )}

      {followModalOpen && (
        <FollowDaoModal user={user} targetDao={address} />
      )}    
    </div>
  )
}

export default DaoUtilityBar

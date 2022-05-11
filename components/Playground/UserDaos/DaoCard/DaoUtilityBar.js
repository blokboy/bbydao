import React from "react"
import { HiStar } from "react-icons/hi"
import { RiUserFollowLine } from "react-icons/ri"
import CreateNurseryBtn from "./CreateNurseryBtn"

import useFriendData from "hooks/useFriendData"
import * as api from "/query"
import { useMutation, useQueryClient } from "react-query"

import dynamic from "next/dynamic"
const Modal = dynamic(() => import("components/Layout/Modal"), { ssr: false })
import DaoToDaoFollowModal from "./DaoToDaoFollowModal"

const DaoUtilityBar = ({ user, safe, isMember }) => {
  // user-to-dao follow logic
  //
  const [friendData, { friendStatus }] = useFriendData(safe)
  const isFollowing = friendStatus?.isFollowing

  const queryClient = useQueryClient()

  const { status, mutateAsync: followDao } = useMutation(api.reqRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["friends", safe], {
        refetchActive: true,
      })
    },
  })

  const { mutateAsync: unfollowDao } = useMutation(api.deleteRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["friends", safe], {
        refetchActive: true,
      })
    },
  })

  const handleUserToDaoFollow = React.useCallback(async () => {
    if (!safe || !user) return
    if (isFollowing) {
      try {
        const req = {
          initiator: user,
          target: safe,
        }
        unfollowDao(req)
        console.log("unfollowDao called", req)
        return
      } catch (error) {
        console.log("unfollowDao Error:", error)
      }
    }
    if (!isFollowing) {
      try {
        const req = {
          initiator: user,
          target: safe,
          status: 4,
        }
        followDao(req)
        console.log("followDao called", req)
        return
      } catch (error) {
        console.log("followDao Error:", error)
      }
    }
  }, [isFollowing])

  const userToDaoFollowBtn = React.useMemo(() => {
    return (
      <button
        className={
          "-transform-y-6 flex h-6 w-6 items-center justify-center rounded-full border bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600" +
          (isFollowing ? " border-green-400 text-green-400" : " border-slate-400")
        }
        onClick={handleUserToDaoFollow}
        title="Follow bbyDAO as a user"
      >
        <HiStar />
      </button>
    )
  }, [isFollowing, handleUserToDaoFollow])

  // dao-to-dao follow logic
  // target address will be the address of the clicked dao follow btn
  // modal to choose which bbyDAO to follow from

  const daoToDaoFollowBtn = React.useMemo(() => {
    return (
      <Modal
        heading="Follow bbyDAO as a bbyDAO!"
        trigger={
          <button className="-transform-y-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600">
            <RiUserFollowLine />
          </button>
        }
      >
        <DaoToDaoFollowModal user={user} targetDao={safe} />
      </Modal>
    )
  }, [])

  return (
    <div className="flex h-0 w-full flex-row items-end justify-end space-x-1">
      {isMember ? (
        <CreateNurseryBtn />
      ) : (
        <React.Fragment>
          {daoToDaoFollowBtn}
          {userToDaoFollowBtn}
        </React.Fragment>
      )}
    </div>
  )
}

export default DaoUtilityBar

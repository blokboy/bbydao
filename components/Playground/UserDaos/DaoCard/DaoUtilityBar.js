import React from "react"
import { HiStar } from "react-icons/hi"
import { RiUserFollowLine } from "react-icons/ri"
import CreateNurseryBtn from "./CreateNurseryBtn"

import { useAccount } from "wagmi"
import * as api from "/query"
import { useMutation, useQuery, useQueryClient } from "react-query"

import dynamic from "next/dynamic"
const Modal = dynamic(() => import("components/Layout/Modal"), { ssr: false })
import DaoToDaoFollowModal from "./DaoToDaoFollowModal"

const DaoUtilityBar = ({ safe, isMember }) => {
  const { data: wagmiAccountData, isError, isLoading } = useAccount()
  const queryClient = useQueryClient()

  const { data: userDaoRel } = useQuery(
    ["userDaoRel", wagmiAccountData?.address, safe],
    () => api.getRelationshipBy({ initiator: wagmiAccountData?.address, target: safe }),
    {
      enabled: !!wagmiAccountData && !isError && !isLoading,
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )

  const { status, mutateAsync: followDao } = useMutation(api.reqRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["daoFollowers", safe], {
        refetchActive: true,
      })
      await queryClient.invalidateQueries(["userDaoRel", wagmiAccountData?.address, safe], {
        refetchActive: true,
      })
    },
  })

  const { mutateAsync: unfollowDao } = useMutation(api.deleteRelationship, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["daoFollowers", safe], {
        refetchActive: true,
      })
      await queryClient.invalidateQueries(["userDaoRel", wagmiAccountData?.address, safe], {
        refetchActive: true,
      })
    },
  })

  const handleUserToDaoFollow = React.useCallback(async () => {
    console.log("userDaoRel", userDaoRel)
    console.log("safe and user", safe, wagmiAccountData?.address)
    if (!safe || !wagmiAccountData) return
    if (userDaoRel) {
      try {
        const req = {
          id: userDaoRel.id,
        }
        unfollowDao(req)
        return
      } catch (error) {
        console.log("unfollowDao Error:", error)
      }
    }
    if (!userDaoRel) {
      try {
        const req = {
          initiator: wagmiAccountData?.address,
          target: safe,
          status: 2,
        }
        followDao(req)
        return
      } catch (error) {
        console.log("followDao Error:", error)
      }
    }
  }, [userDaoRel, wagmiAccountData])

  const userToDaoFollowBtn = React.useMemo(() => {
    return (
      <button
        className={
          "-transform-y-6 flex h-6 w-6 items-center justify-center rounded-full border bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600" +
          (userDaoRel ? " border-green-400 text-green-400" : " border-slate-400")
        }
        onClick={handleUserToDaoFollow}
        title="Follow bbyDAO as a user"
      >
        <HiStar />
      </button>
    )
  }, [userDaoRel, handleUserToDaoFollow])

  // dao-to-dao follow logic
  // target address will be the address of the clicked dao follow btn
  // modal to choose which bbyDAO to follow from

  const daoToDaoFollowBtn = React.useMemo(() => {
    return (
      <Modal
        heading="Follow bbyDAO as a bbyDAO!"
        trigger={
          <button
            className="-transform-y-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600"
            title="bbyDao2bbyDao follow"
          >
            <RiUserFollowLine />
          </button>
        }
      >
        <DaoToDaoFollowModal user={wagmiAccountData?.address} targetDao={safe} />
      </Modal>
    )
  }, [wagmiAccountData])

  return (
    <div className="flex h-0 w-full flex-row items-end justify-end space-x-1">
      {isMember ? (
        <CreateNurseryBtn daoAddress={safe} />
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

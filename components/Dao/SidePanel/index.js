import React from "react"
import { useQuery, useMutation } from "react-query"
import { useAccount, useConnect } from "wagmi"

import * as api from "../../../query"
import { HiOutlineUsers } from "react-icons/hi"
import MemberCard from "./MemberCard"
import { useUiStore } from "stores/useUiStore"
import { useDaoStore } from "stores/useDaoStore"
import useFriendData from "hooks/useFriendData"
import { walletSnippet } from "utils/helpers"

const SidePanel = ({ safeInfo, nftImage }) => {
  const [{ data }] = useAccount()
  const [dropdown, setDropdown] = React.useState(false)
  const followDaoModalOpen = useUiStore(state => state.followDaoModalOpen)
  const setFollowDaoModalOpen = useUiStore(state => state.setFollowDaoModalOpen)
  const [friendData, { friendStatus, refetch }, friendActionText] = useFriendData(safeInfo.address)

  const setEditDaoMemberModalOpen = useDaoStore(state => state.setEditDaoMemberModalOpen)

  const parsedList = React.useMemo(() => {
    if (!friendData) {
      return { friends: [], followers: [] }
    }

    return {
      friends: friendData.filter(friend => friend.status === 1),
      followers: friendData.filter(friend => friend.status === 4),
    }
  }, [friendData])

  const { status, mutateAsync } = useMutation(api.reqRelationship, {
    onSuccess: refetch,
  })

  const { mutateAsync: unfriendMutateAsync } = useMutation(api.updateRelationship, {
    onSuccess: refetch,
  })

  const setFriendsModalAddress = useUiStore(state => state.setFriendsModalAddress)
  const setFriendsModalOpen = useUiStore(state => state.setFriendsModalOpen)

  const handleOpenFriendsModal = () => {
    setFriendsModalAddress(safeInfo.address)
    setFriendsModalOpen()
  }

  const handleFollow = React.useCallback(() => {
    if (!data || !safeInfo || !friendStatus) {
      return
    }
    const req = {
      initiator: data.address,
      target: safeInfo.address,
      status: 4,
    }

    mutateAsync(req)
  }, [data, safeInfo, friendStatus])

  const handleUnfollow = React.useCallback(() => {
    if (!data || !friendStatus.data) {
      return
    }

    unfriendMutateAsync({ id: friendStatus.data.id, status: 0 })
  }, [data, friendStatus])

  return (
    <div className="flex-start flex h-full flex-col md:flex-col">
      <div className="mb-3 flex place-content-center">
        {nftImage ? <img src={nftImage} alt="alt" width={200} /> : <></>}
      </div>
      <div className="flex flex-col items-center md:items-start">
        <h1 className="">dao address</h1>
        <span
          className="mb-3 cursor-pointer bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-2xl font-semibold text-transparent"
          onClick={() => {
            navigator.clipboard.writeText(safeInfo?.address ? safeInfo.address : "")
          }}
        >
          {walletSnippet(safeInfo?.address)}
        </span>
      </div>

      <div className="flex flex-col items-start">
        <button className="cursor-pointer" onClick={handleOpenFriendsModal}>
          <h1>
            {parsedList.followers?.length || 0} {parsedList.followers?.length === 1 ? "follower" : "followers"}
          </h1>
        </button>
        <button className="cursor-pointer" onClick={handleOpenFriendsModal}>
          <h1>
            {parsedList.friends?.length || 0} {parsedList.friends?.length === 1 ? "friend" : "friends"}
          </h1>
        </button>
      </div>

      <button
        onClick={() => setDropdown(!dropdown)}
        className="my-4 mr-3 flex w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
      >
        <span className="block rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
          be frens
        </span>
      </button>

      {/* follow or friend buttons when be frens is clicked  */}
      {dropdown ? (
        <div className="flex flex-col items-start">
          <button
            className="my-1 w-full cursor-pointer rounded-xl bg-slate-300 p-1 shadow hover:bg-slate-400 disabled:cursor-not-allowed dark:bg-slate-800 dark:hover:bg-slate-700"
            onClick={friendStatus.isFollowing ? handleUnfollow : handleFollow}
          >
            <span className="font-bold">{friendStatus.isFollowing ? "following" : "follow"}</span>
          </button>
          <button
            className="my-1 w-full cursor-pointer rounded-xl bg-slate-300 p-1 shadow hover:bg-slate-400 disabled:bg-slate-400 disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700"
            onClick={setFollowDaoModalOpen}
            disabled={friendStatus.isFriend}
          >
            <span className="font-bold">{friendActionText}</span>
          </button>
        </div>
      ) : null}

      {/* make component to represent these (with pics) */}
      {/* modal pops to center of screen to scroll through all members */}
      <div className="space-y-2 p-3">
        <div className="flex flex-row space-x-2 px-2">
          <div className="rounded-xl border bg-slate-100 px-2 py-1 dark:bg-slate-800">members</div>
          <button className="icon-util-btn" onClick={setEditDaoMemberModalOpen}>
            <HiOutlineUsers size={18} />
          </button>
        </div>
        <div className="rounded-xl border p-2">
          <div className="flex flex-col space-y-2">
            {safeInfo.owners.map((member, index) => (
              <MemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidePanel

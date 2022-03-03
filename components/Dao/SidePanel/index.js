import React from "react"
import MemberCard from "./MemberCard"
import { useUiStore } from "stores/useUiStore"
import { useQuery, useMutation } from "react-query"
import { useAccount, useConnect } from "wagmi"
import * as api from "../../../query"


const SidePanel = ({ safeInfo, nftImage }) => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const [dropdown, setDropdown] = React.useState(false)
  const followDaoModalOpen = useUiStore(state => state.followDaoModalOpen)
  const setFollowDaoModalOpen = useUiStore(state => state.setFollowDaoModalOpen)

  const { data: friendData } = useQuery(
    ["friends", safeInfo.address],
    () => api.getFriends({ initiator: safeInfo.address }),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )

  const getUserRelationship = friends => {
    let relationship

    if (!friends?.length) {
      return
    }

    for (const friend of friends) {
      if (friend.initiator == data?.address || friend.target == data?.address) {
        relationship = friend.status
        return relationship
      }
    }

    return null
  }

  const parsedList = {
    followers: [],
    friends: []
  }
  if(friendData?.length) {
    for(const friend of friendData) {
      if(friend.status == 4) {
        parsedList.followers.push(friend)
      }
    }
  }

  

  const { status, mutateAsync } = useMutation(api.reqRelationship)

  const setFriendsModalAddress = useUiStore(
    state => state.setFriendsModalAddress
  )
  const setFriendsModalOpen = useUiStore(state => state.setFriendsModalOpen)

  const handleOpenFriendsModal = () => {
    setFriendsModalAddress(safeInfo.address)
    setFriendsModalOpen()
  }

  const handleRequest = () => {
    if (!data?.address) {
      return
    }
    const req = {
      initiator: data.address,
      target: safeInfo.address,
      status: 4,
    }

    mutateAsync(req)
  }

  return (
    <div className="flex-start mx-1 mb-3 flex h-full flex-col px-4 md:flex-col">
      <div className="mb-3 flex place-content-center">
        {nftImage ? <img src={nftImage} alt="alt" width={200} /> : <></>}
      </div>
      <div className="flex flex-col items-center md:items-start">
        <h1 className="">dao address</h1>
        <span
          className="mb-3 cursor-pointer bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-2xl font-semibold text-transparent"
          onClick={() => {
            navigator.clipboard.writeText(
              safeInfo?.address ? safeInfo.address : ""
            )
          }}
        >
          {safeInfo.address.substring(0, 6) +
            "..." +
            safeInfo.address.substring(
              safeInfo.address.length - 5,
              safeInfo.address.length - 1
            )}
        </span>
      </div>

      <div className="flex flex-col items-start">
        <button className="cursor-pointer" onClick={handleOpenFriendsModal}>
          <h1>
            {parsedList.followers?.length || 0}{" "}
            {parsedList.followers?.length === 1 ? "follower" : "followers"}
          </h1>
        </button>
        <button className="cursor-pointer" onClick={handleOpenFriendsModal}>
          <h1>
            {parsedList.friends?.length || 0}{" "}
            {parsedList.friends?.length === 1 ? "friend" : "friends"}
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
            className="my-1 w-full cursor-pointer rounded-xl bg-slate-300 p-1 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700"
            onClick={() => {
              if (getUserRelationship(friendData) === 4) {
                return
              } else {
                handleRequest()
              }
            }}
          >
            <h1>{ getUserRelationship(friendData) === 4 ? "following" : "follow"}</h1>
          </button>
          <button
            className="my-1 w-full cursor-pointer rounded-xl bg-slate-300 p-1 shadow hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700"
            onClick={setFollowDaoModalOpen}
          >
            <h1>friend</h1>
          </button>
        </div>
      ) : (
        <></>
      )}

      {/* make component to represent these (with pics) */}
      {/* modal pops to center of screen to scroll through all members */}
      <h1>members</h1>
      <div className="h-72 overflow-auto p-1">
        {safeInfo.owners.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  )
}

export default SidePanel

import React from "react"
import MemberCard from "./MemberCard"
import { useUiStore } from "stores/useUiStore"
import { useQuery } from "react-query"

const SidePanel = ({ safeInfo, nftImage }) => {
  const { data: friendData } = useQuery(
    ["friends", safeInfo.address],
    () => api.getFriends({ initiator: safeInfo.address }),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )

  const setFriendsModalAddress = useUiStore(
    state => state.setFriendsModalAddress
  )
  const setFriendsModalOpen = useUiStore(state => state.setFriendsModalOpen)

  const handleOpenFriendsModal = () => {
    setFriendsModalAddress(safeInfo.address)
    setFriendsModalOpen()
  }

  

  return (
    <div className="flex-start mx-1 mb-3 flex h-full flex-col px-4 md:flex-col">
      <div className="mb-3 flex place-content-center">
        {nftImage ? <img src={nftImage} alt="alt" width={200} /> : <></>}
      </div>
      <div className="flex flex-col items-center md:items-start">
        <h1 className="">dao address</h1>
        <span className="mb-3 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-2xl font-semibold text-transparent">
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
          <h1>{friendData?.length || 1} {friendData?.length === 1 ? "follower" : "followers"}</h1>
        </button>
        <button className="cursor-pointer" onClick={handleOpenFriendsModal}>
          <h1>{friendData?.length || 1 } {friendData?.length === 1 ? "friend" : "friends"}</h1>
        </button>
      </div>

      <button
      className="mr-3 my-4 flex w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
      >
      <span className="block rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
        be frens
      </span>
    </button>

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

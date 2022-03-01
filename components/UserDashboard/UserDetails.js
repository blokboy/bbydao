import React from "react"
import Link from "next/link"
import { useUiStore } from "stores/useUiStore"
import { useMutation, useQuery } from "react-query"
import * as api from "../../query"
import { useAccount, useConnect } from "wagmi"

const UserDetails = ({ address, ens }) => {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data, error, loading }, disconnect] = useAccount()
  const { data: friendData } = useQuery(
    ["friends", address],
    () => api.getFriends({ initiator: address }),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
    }
  )
  let parsedList = {
    friends: [],
    following: [],
  }
  if (friendData) {
    for (const friend of friendData) {
      if (friend.status === 4) {
        parsedList.following.push(friend)
      } else {
        parsedList.friends.push(friend)
      }
    }
  }

  const setFriendsModalAddress = useUiStore(
    state => state.setFriendsModalAddress
  )
  const setFriendsModalOpen = useUiStore(state => state.setFriendsModalOpen)

  const { status, mutateAsync } = useMutation(api.reqRelationship)

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

  const handleRequest = () => {
    if (!data?.address) {
      return
    }
    const req = {
      initiator: data.address,
      target: address,
      status: 3,
    }

    mutateAsync(req)
  }

  const handleOpenFriendsModal = () => {
    setFriendsModalAddress(address)
    setFriendsModalOpen()
  }

  return (
    <div className="mt-4 flex flex-col items-center text-center md:items-start md:text-left">
      {ens ? (
        <span className="h-10 w-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-3xl text-transparent">
          @{ens}
        </span>
      ) : (
        <span className="h-10 w-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-3xl text-transparent">
          @{`${address.substring(0, 6) + "..."}`}
        </span>
      )}

      {data?.address === address ? (
        <></>
      ) : status === "success" ? (
        // style and persist through validating relationship status
        <span className="my-4 w-max rounded-full bg-slate-200 px-4 py-2 shadow hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-700">
          success
        </span>
      ) : connectData?.connected && getUserRelationship(friendData) === 1 ? (
        <button className="mr-3 flex w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700">
          <span className="block rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
            frens
          </span>
        </button>
      ) : (
        <button
          className="my-4 w-max rounded-full bg-slate-200 px-4 py-2 shadow hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-700"
          onClick={() => {
            if (getUserRelationship(friendData) === 3) {
              return
            } else {
              handleRequest()
            }
          }}
        >
          {data?.address && getUserRelationship(friendData) === 3
            ? "pending"
            : "request"}
        </button>
      )}
      <div className="mt-4 ml-4 mb-4 mr-4 flex flex-col">
        <button className="cursor-pointer" onClick={handleOpenFriendsModal}>
          <h1>
            {parsedList.following?.length}{" "}
            {parsedList.following?.length > 1 ? "follows" : "follow"}
          </h1>
        </button>
        <button className="cursor-pointer" onClick={handleOpenFriendsModal}>
          <h1>
            {parsedList.friends?.length}{" "}
            {parsedList.friends?.length === 1 ? "friend" : "friends"}
          </h1>
        </button>
      </div>
    </div>
  )
}

export default UserDetails

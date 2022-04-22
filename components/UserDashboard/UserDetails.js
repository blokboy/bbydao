import React from "react"
import Link from "next/link"
import { useMutation } from "react-query"

import * as api                   from "../../query"
import { useUiStore }             from "stores/useUiStore"
import { useAccount, useConnect } from "wagmi"
import useFriendData              from "hooks/useFriendData"
import { walletSnippet }          from "../../utils/helpers"

const UserDetails = ({ address, ens }) => {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data, error, loading }, disconnect] = useAccount()
  const [friendData, { friendStatus, refetch }, friendActionText] =
    useFriendData(address)

  const parsedList = React.useMemo(() => {
    let list = {
      friends: [],
      following: [],
    }

    if (friendData) {
      for (const friend of friendData) {
        if (friend.status === 4) {
          list.following.push(friend)
        } else {
          list.friends.push(friend)
        }
      }
    }

    return list
  }, [friendData])

  const setFriendsModalAddress = useUiStore(
    state => state.setFriendsModalAddress
  )
  const setFriendsModalOpen = useUiStore(state => state.setFriendsModalOpen)

  const setUnfriendModalFriendStatus = useUiStore(
    state => state.setUnfriendModalFriendStatus
  )
  const setUnfriendModalOpen = useUiStore(state => state.setUnfriendModalOpen)

  const { mutateAsync } = useMutation(api.reqRelationship, {
    onSuccess: () => {
      refetch()
    },
  })

  const handleRequest = React.useCallback(() => {
    if (!data) {
      return
    }

    const req = {
      initiator: data.address,
      target: address,
      status: 3,
    }

    mutateAsync(req)
  }, [address, data])

  const handleOpenFriendsModal = React.useCallback(() => {
    setFriendsModalAddress(address)
    setFriendsModalOpen()
  }, [address])

  const handleOpenUnfriendModal = React.useCallback(() => {
    setUnfriendModalFriendStatus({ ...friendStatus, refetch })
  }, [address, friendStatus])

  const friendActionSection = React.useMemo(() => {
    if (
      !data ||
      !connectData ||
      friendStatus === null ||
      data.address === address
    ) {
      return null
    }
    return (
      <>
        {connectData.connected && friendStatus.isFriend ? (
          <button
            type="button"
            onClick={handleOpenUnfriendModal}
            className="mr-3 flex w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
          >
            <span className="block rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
              frens
            </span>
          </button>
        ) : (
          <button
            className="my-4 w-max rounded-full bg-slate-200 px-4 py-2 shadow hover:bg-white disabled:cursor-not-allowed dark:bg-slate-900 dark:hover:bg-slate-700"
            type="button"
            disabled={!friendStatus.data && friendStatus.isRequested}
            onClick={
              friendStatus.isRequested ? handleOpenUnfriendModal : handleRequest
            }
          >
            {friendActionText}
          </button>
        )}
      </>
    )
  }, [
    address,
    connectData,
    data,
    friendStatus,
    friendActionText,
    handleOpenUnfriendModal,
    handleRequest,
  ])

  return (
    <div className="mt-4 flex flex-col items-center text-center">
      {ens ? (
        <span className="h-10 w-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-3xl text-transparent">
          @{ens}
        </span>
      ) : (
        <span className="h-10 w-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-3xl text-transparent">
          @{`${walletSnippet(address)}`}
        </span>
      )}

      {friendActionSection}

      <div className="mt-4 ml-4 mb-4 mr-4 flex flex-col">
        <button className="cursor-pointer" onClick={handleOpenFriendsModal}>
          <h1>
            <span>{parsedList.following?.length} </span>
            <span>
              {parsedList.following?.length > 1 ? "follows" : "follow"}
            </span>
          </h1>
        </button>
        <button className="cursor-pointer" onClick={handleOpenFriendsModal}>
          <h1>
            <span>{parsedList.friends?.length} </span>
            <span>
              {parsedList.friends?.length === 1 ? "friend" : "friends"}
            </span>
          </h1>
        </button>
      </div>
    </div>
  )
}

export default UserDetails

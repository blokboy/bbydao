import React from "react"
import { BsPeople } from "react-icons/bs"
import dynamic from "next/dynamic"
const Modal = dynamic(() => import("components/Layout/Modal"), { ssr: false })
import { useQueryClient } from "react-query"
import { walletSnippet } from "utils/helpers"
import FollowerModal from "./FollowerModal"

const UserFollowers = ({ address, numFollowers, followers, isFollowing }) => {
  const queryClient = useQueryClient()
  const target = queryClient.getQueryData("targetAddress")
  const userName = target?.ens || walletSnippet(address)

  return (
    <div className="flex flex-row items-center justify-center space-x-2">
      <Modal
        heading={`${userName}'s followers`}
        trigger={
          <button className="flex flex-row items-center justify-center space-x-1 hover:text-teal-300">
            <div className="flex p-0.5">
              <BsPeople size={18} />
            </div>
            <div className="font-bold">{numFollowers}</div>
            <div className="flex items-center justify-center font-medium">
              {numFollowers === 1 ? " follower" : " followers"}
            </div>
          </button>
        }
      >
        <FollowerModal followers={followers} />
      </Modal>
    </div>
  )
}

export default UserFollowers

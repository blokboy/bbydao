import React from "react"
import { BsPeople } from "react-icons/bs"
import Modal from "components/Layout/Modal"
import FollowerModal from "./FollowerModal"

const UserFollowers = ({ numFollowers, followers, friendStatus }) => {
  const [followerModal, setFollowerModal] = React.useState(false)

  const toggleFollowerModal = React.useCallback(() => {
    setFollowerModal(!followerModal)
  }, [followerModal, setFollowerModal])

  return (
    <div className="flex flex-row items-center justify-center space-x-2">
      <button
        className="flex flex-row items-center justify-center space-x-1 hover:text-teal-300"
        onClick={toggleFollowerModal}
      >
        <div className="flex p-0.5">
          <BsPeople size={18} />
        </div>
        <div className="font-bold">{numFollowers}</div>
        <div className="flex items-center justify-center font-medium">
          {numFollowers === 1 ? " follower" : " followers"}
        </div>
      </button>
      {followerModal && (
        <Modal heading={"followers"} close={toggleFollowerModal}>
          <FollowerModal followers={followers} />
        </Modal>
      )}
    </div>
  )
}

export default UserFollowers

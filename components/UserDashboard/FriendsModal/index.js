import React from "react"
import FriendSearch from "./FriendSearch"
import { useUiStore } from "stores/useUiStore"

const FriendsModal = () => {
  const friendsModalAddress = useUiStore(state => state.friendsModalAddress)
  const friendsModalOpen = useUiStore(state => state.friendsModalOpen)
  const setFriendsModalOpen = useUiStore(state => state.setFriendsModalOpen)

  const closeModal = e => {
    if (!friendsModalOpen && e.target) {
      return
    }
    setFriendsModalOpen()
  }

  if (!friendsModalOpen) return <></>

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      <FriendSearch address={friendsModalAddress} closeModal={closeModal} />
    </div>
  )
}

export default FriendsModal

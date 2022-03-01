import React from "react"
import FriendSearchCard from "./FriendSearchCard"

const FriendSearchResults = ({ friends, closeModal }) => {
  return (
    <div className="mt-3 flex h-full flex-col overflow-scroll">
      {friends.map((friend, index) => (
        <FriendSearchCard key={index} friend={friend} closeModal={closeModal} />
      ))}
    </div>
  )
}

export default FriendSearchResults

import React from "react"
import FriendSearchCard from "./FriendSearchCard"

const FriendSearchResults = ({ friends, closeModal, follows }) => {
  console.log('frens ', friends)
  return (
    <div className="mt-3 flex h-full flex-col overflow-scroll">
      <h1>frens</h1>
      {friends.map((friend, index) => (
        <FriendSearchCard key={index} friend={friend} closeModal={closeModal} />
      ))}
      <br />
      <h1>{ follows ? 'follows': ''}</h1>
      {follows.map((friend, index) => (
        <FriendSearchCard key={index} friend={friend} closeModal={closeModal} />
      ))}
    </div>
  )
}

export default FriendSearchResults

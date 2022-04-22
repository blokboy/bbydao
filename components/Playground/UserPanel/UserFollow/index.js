import React from 'react'
import UserFollowers from './UserFollowers'
import FollowUserBtn from './FollowUserBtn'

const UserFollow = () => {
  return (
    <div className='flex flex-col justify-center items-center space-y-1'>
      <UserFollowers />
      <FollowUserBtn />
    </div>
  )
}

export default UserFollow
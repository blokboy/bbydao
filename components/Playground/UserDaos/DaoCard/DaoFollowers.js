import React, { useState } from "react"
import useFriendData from "hooks/useFriendData"
import { useQueryClient } from "react-query"
import { walletSnippet } from "utils/helpers"
import Modal from "components/Layout/Modal"
import FollowerModal from "components/Playground/UserPanel/UserFollow/FollowerModal"

const DaoFollowers = ({ address }) => {
  const [friendData, { friendStatus }] = useFriendData(address)
  const [followerModal, setFollowerModal] = React.useState(false)
  const queryClient = useQueryClient()
  const bbyDao = queryClient.getQueryData(["dao", address])

  const toggleFollowerModal = React.useCallback(() => {
    setFollowerModal(!followerModal)
  }, [followerModal, setFollowerModal])

  const parsedList = React.useMemo(() => {
    let list = []
    if (friendData) {
      for (const friend of friendData) {
        if (friend.status === 4 && friend.initiator !== address) {
          list.push(friend)
        } else {
          null
        }
      }
    }
    return list
  }, [friendData])

  return (
    <div>
      <button onClick={toggleFollowerModal} className="px-2 text-xs">
        {parsedList?.length} followers
      </button>

      {followerModal && (
        <Modal heading={`${bbyDao?.name || walletSnippet(bbyDao?.address)}'s followers`} close={toggleFollowerModal}>
          <FollowerModal followers={parsedList} />
        </Modal>
      )}
    </div>
  )
}

export default DaoFollowers

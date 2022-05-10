import React, { useState } from "react"
import useFriendData from "hooks/useFriendData"
import { useQueryClient } from "react-query"
import { walletSnippet } from "utils/helpers"
import dynamic from "next/dynamic"
const Modal = dynamic(() => import("components/Layout/Modal"), { ssr: false })
import FollowerModal from "components/Playground/UserPanel/UserFollow/FollowerModal"

const DaoFollowers = ({ address }) => {
  const [friendData, { friendStatus }] = useFriendData(address)
  const queryClient = useQueryClient()
  const bbyDao = queryClient.getQueryData(["dao", address])

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
      <Modal
        heading={`${bbyDao?.name || walletSnippet(bbyDao?.address)}'s followers`}
        trigger={
          <button type="button" className="px-2 text-xs">
            {parsedList?.length} followers
          </button>
        }
      >
        <FollowerModal followers={parsedList} />
      </Modal>
    </div>
  )
}

export default DaoFollowers

import React from "react"
import { useAccountStore } from "../../stores/useAccountStore"
import { useMutation } from "react-query"
import * as api from "../../query"
import { IoMdAddCircle } from "react-icons/io"

const ResultCard = ({ username, targetId }) => {
  const userData = useAccountStore(state => state.userData)
  const { id: initiatorId } = userData

  const { status, mutate } = useMutation(api.reqRelationship)

  const handleRequest = () => {
    mutate({ initiatorId: initiatorId, targetId: targetId, status: 3 })
  }

  return (
    <div className="flex flex-row mb-3 rounded-lg bg-gray-50 dark:bg-gray-800 justify-between py-2 px-1 w-full">
      <span>{username}</span>
      {status === "loading" ? (
        <span className="mr-4 border rounded-lg text-xs p-1">loading</span>
      ) : status === "success" ? (
        <span className="mr-4 border rounded-lg text-xs p-1">requested</span>
      ) : (
        <button className="mr-4" onClick={handleRequest}>
          <IoMdAddCircle size={24} />
        </button>
      )}
    </div>
  )
}

export default ResultCard

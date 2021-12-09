import React from "react"
import { useAccountStore } from "../../stores/useAccountStore"
import { useMutation } from "react-query"
import * as api from "../../query"

const ResultCard = ({ username, targetId }) => {
  const { id: initiatorId } = useAccountStore.getState().userData
  const { status, mutate } = useMutation(api.reqRelationship)

  const handleRequest = () => {
    const req = {
      initiatorId: initiatorId,
      targetId: targetId,
      status: 3,
    }

    mutate(req)
  }

  return (
    <div className="flex flex-row mb-3 rounded-lg bg-gray-50 dark:bg-gray-800 justify-between py-2 px-1 w-full">
      <span>{username}</span>
      {status === "loading" ? (
        <span className="mr-4 border rounded-lg text-xs p-1">loading</span>
      ) : status === "success" ? (
        <span className="mr-4 border border-green-400 rounded-lg text-xs text-green-400 p-1">
          requested
        </span>
      ) : (
        <button
          className="border rounded-lg text-xs mr-4 p-1"
          onClick={handleRequest}
        >
          request
        </button>
      )}
    </div>
  )
}

export default ResultCard

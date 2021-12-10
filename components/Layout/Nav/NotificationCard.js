import React from "react"
import { useMutation, useQueryClient } from "react-query"
import { updateRelationship, deleteNotification } from "../../../query"

const NotificationCard = ({ body, id, relationshipRef }) => {
  const queryClient = useQueryClient()
  const accept = useMutation(updateRelationship)
  const reject = useMutation(deleteNotification, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("notifications", {
        refetchActive: true,
      })
    },
  })

  const handleAccept = () => {
    const req = {
      id: relationshipRef,
      status: 2,
    }

    accept.mutateAsync(req)
  }

  const handleReject = () => {
    const req = {
      id: id,
      seen: true,
    }

    reject.mutateAsync(req)
  }

  return (
    <li className="flex flex-row mb-1 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm justify-between p-1 w-full">
      <span>{body}</span>
      <div>
        <button
          className="border rounded-lg text-xs mr-2 px-1"
          onClick={handleAccept}
        >
          accept
        </button>
        <button
          className="border rounded-lg text-xs px-1"
          onClick={handleReject}
        >
          reject
        </button>
      </div>
    </li>
  )
}

export default NotificationCard

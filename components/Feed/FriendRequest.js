import React from "react"
import { useInViewEffect } from "react-hook-inview"
import { useMutation, useQueryClient } from "react-query"
import * as api from "query"

// friend request card
const FriendRequest = ({ body, id, relationshipRef, seen }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  const queryClient = useQueryClient()
  const acceptRelationship = useMutation(api.updateRelationship)

  const updateNotif = useMutation(api.updateNotification, {
    onSuccess: async () => {
      // this updates the query, seen: true
      // call less frequently
      await queryClient.invalidateQueries("notifications", {
        refetchActive: true,
      })
    },
  })

  const rejectRelationship = useMutation(api.deleteNotification, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("notifications", {
        refetchActive: true,
      })
    },
  })

  const ref = useInViewEffect(
    ([entry], observer) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)
      }
      setIsVisible(entry.isIntersecting)
    },
    { threshold: 0.5 }
  )

  React.useEffect(() => {
    if (seen) return
    console.log("is visible")

    updateNotifSeen()
  }, [isVisible]) /* eslint-disable-line react-hooks/exhaustive-deps */

  const updateNotifSeen = () => {
    const req = {
      id: id,
      seen: true,
    }

    console.log("mutate func:", req)

    // updateNotif.mutateAsync(req)
  }

  const handleAcceptRelationship = () => {
    if (!relationshipRef) return

    const req = {
      id: relationshipRef,
      notificationId: id,
      status: 1,
    }

    acceptRelationship.mutateAsync(req)
  }

  const handleRejectRelationship = () => {
    if (!id) return

    const req = {
      id: id,
      seen: true,
    }

    rejectRelationship.mutateAsync(req)
  }

  return (
    <div
      className="mx-auto mb-3 flex w-11/12 flex-row justify-between rounded-lg bg-slate-50 py-4 px-3 dark:bg-slate-900 md:w-6/12"
      ref={ref}
    >
      <span>{body}</span>
      <div>
        <button
          className="mr-4 rounded-lg border bg-green-500 p-1 text-xs hover:bg-green-400"
          onClick={handleAcceptRelationship}
        >
          accept
        </button>
        <button
          className="mr-4 rounded-lg border bg-red-500 p-1 text-xs hover:bg-red-400"
          onClick={handleRejectRelationship}
        >
          reject
        </button>
      </div>
    </div>
  )
}

export default FriendRequest

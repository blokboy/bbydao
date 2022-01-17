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
      className="flex flex-row mb-3 mx-auto rounded-lg bg-slate-50 dark:bg-slate-900 justify-between py-4 px-3 w-11/12 md:w-6/12"
      ref={ref}
    >
      <span>{body}</span>
      <div>
        <button
          className="border rounded-lg bg-green-500 hover:bg-green-400 text-xs mr-4 p-1"
          onClick={handleAcceptRelationship}
        >
          accept
        </button>
        <button
          className="border rounded-lg bg-red-500 hover:bg-red-400 text-xs mr-4 p-1"
          onClick={handleRejectRelationship}
        >
          reject
        </button>
      </div>
    </div>
  )
}

export default FriendRequest

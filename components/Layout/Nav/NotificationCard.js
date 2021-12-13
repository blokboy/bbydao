import React from "react"
import { useInViewEffect } from "react-hook-inview"
import { useMutation, useQueryClient } from "react-query"
import * as api from "../../../query"

const NotificationCard = ({ ...props }) => {
  const { body, id, relationshipRef, seen, notificationsOpen } = props

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
    if (seen || !notificationsOpen) return
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
      status: 2,
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
    <li
      className="flex flex-row mb-1 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm justify-between p-1 w-full"
      ref={ref}
    >
      <span>{body}</span>
      <div>
        <button
          className="border rounded-lg text-xs mr-2 px-1"
          onClick={handleAcceptRelationship}
        >
          accept
        </button>
        <button
          className="border rounded-lg text-xs px-1"
          onClick={handleRejectRelationship}
        >
          reject
        </button>
      </div>
    </li>
  )
}

export default NotificationCard

import React from "react"
import { useInViewEffect } from "react-hook-inview"
import { useMutation, useQueryClient } from "react-query"
import * as api from "query"

import { HiOutlineCheckCircle } from "react-icons/hi"
import { HiOutlineXCircle } from "react-icons/hi"

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
    <li
      className="mb-2 flex w-full flex-row justify-between rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800"
      ref={ref}
    >
      <span>{body}</span>

      <div>
        <button
          className="px-1 text-green-500 hover:text-green-400"
          onClick={handleAcceptRelationship}
        >
          <HiOutlineCheckCircle size={22} />
        </button>
        <button
          className="px-1 text-red-500 hover:text-red-400"
          onClick={handleRejectRelationship}
        >
          <HiOutlineXCircle size={22} />
        </button>
      </div>
    </li>
  )
}

export default NotificationCard

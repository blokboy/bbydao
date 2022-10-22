import React from "react"
import { createPortal } from "react-dom"
import ClickAwayListener from "react-click-away-listener"
import { FiBell } from "react-icons/fi"
import { useAccount } from "wagmi"
import { useUiStore } from "stores/useUiStore"
// import useNotifications from "hooks/useNotifications"

export default function MobileNotificationsModal() {
  const { data: account } = useAccount()

  // const notifications = useNotifications(account?.address)
  const isOpen = useUiStore(state => state.mobileNotificationsOpen)
  const setOpen = useUiStore(state => state.setMobileNotificationsOpen)

  const closeModal = React.useCallback(() => {
    if (isOpen) {
      setOpen(false)
    }
  }, [isOpen, setOpen])

  // const notificationsList = React.useMemo(() => {
  //   return !notifications.length ? (
  //     <li>
  //       <p className="text-center">¯\_(ツ)_/¯</p>
  //       <p className="text-center">No notifications</p>
  //     </li>
  //   ) : (
  //     <>
  //       {notifications.map(notif => (
  //         <NotificationCard
  //           key={notif.id}
  //           id={notif.id}
  //           relationshipRef={notif.ref}
  //           body={notif.body}
  //           seen={notif.seen}
  //           notificationsOpen={notificationsOpen}
  //         />
  //       ))}
  //     </>
  //   )
  // }, [notifications])

  return React.useMemo(() => {
    return isOpen
      ? createPortal(
          <div role="document" aria-modal={true} className="fixed inset-0 flex items-center justify-center p-4">
            <ClickAwayListener onClickAway={closeModal}>
              <div className="min-h-[66vh] w-full rounded-lg bg-slate-200 px-4 py-2 shadow-lg dark:bg-slate-900">
                {/* <h2 className="p-4 text-center text-lg">Notifications</h2>
                <ul className="mt-4">{notificationsList}</ul> */}
              </div>
            </ClickAwayListener>
          </div>,
          document.querySelector("body")
        )
      : null
  }, [isOpen])
}

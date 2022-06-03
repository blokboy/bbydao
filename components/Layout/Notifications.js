import React from "react"
import Notify from "bnc-notify"
import { useAccount } from "wagmi"
import { useTheme } from "next-themes"

import useDAOs from "../../hooks/useDAOs"

export default function Notifications() {
  const { data: account } = useAccount()
  const { data: daos, isDAOsLoading } = useDAOs()
  const [isTracking, setTracking] = React.useState(false)

  const { theme } = useTheme()

  const notify = React.useMemo(() => {
    return Notify({
      dappId: process.env.NEXT_PUBLIC_BNC_NOTIFY_API,
      networkId: 1,
      darkMode: theme === "dark",
      mobilePosition: "bottom",
      desktopPosition: "topRight",
    })
  }, [theme])

  const trackAccounts = React.useCallback(() => {
    if (account?.address && !isDAOsLoading && !isTracking) {
      notify.account(account?.address)
      if (daos.length) {
        daos.forEach(dao => {
          notify.account(dao)
        })
      }
      setTracking(true)
    }
  }, [account, daos, notify, isDAOsLoading, isTracking])

  React.useEffect(trackAccounts, [trackAccounts])

  return null
}

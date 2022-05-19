import React from "react"
import Notify from "bnc-notify"
import { useTheme } from "next-themes"

export default function useNotify() {
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

  return notify
}

import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export function useRelativeTime() {
  const formattedDate = React.useCallback((timestamp: Date) => {
    return dayjs(timestamp).format("YYYY-MM-DD")
  }, [])

  const timeFromNow = React.useCallback(
    (timestamp: Date) => {
      const date = formattedDate(timestamp)

      return dayjs(date).fromNow()
    },
    [formattedDate]
  )

  return { formattedDate, timeFromNow }
}

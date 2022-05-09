import React from "react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export function useRelativeTime() {
  const timeFromNow = React.useCallback((timestamp: Date) => {
    const date = dayjs(timestamp).format("YYYY-MM-DD")

    return dayjs(date).fromNow()
  }, [])

  return { timeFromNow }
}

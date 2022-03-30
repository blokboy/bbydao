import dayjs from "dayjs"
import React from "react"
// import { useEnsLookup } from "wagmi"

const MessageCard = ({ message }) => {
  // causes a lot of requests when loading messages
  // const [{ data, error, loading }, lookupAddress] = useEnsLookup({
  //   address: message?.sender,
  // })

  // timestamp that prints out diff from current time
  const diffTimestap = () => {
    const date = dayjs(message?.updatedAt)
    const now = dayjs()
    const diff = now.diff(date, "minute")
    if (diff < 1) {
      return "just now"
    }
    if (diff < 60) {
      return `${diff} minutes ago`
    }
    if (diff < 60 * 24) {
      return `${Math.round(diff / 60)} hours ago`
    }
    if (diff < 60 * 24 * 7) {
      return `${Math.round(diff / 60 / 24)} days ago`
    }
    if (diff < 60 * 24 * 30) {
      return `${Math.round(diff / 60 / 24 / 7)} weeks ago`
    }
    if (diff < 60 * 24 * 365) {
      const monthCalc = Math.round(diff / 60 / 24 / 30)
      if (monthCalc === 1) {
        return `${monthCalc} month ago`
      } else {
        return `${monthCalc} months ago`
      }
    }
  }

  // more precise timestamp - will develop a feature to show the exact time
  const prettyTimestamp = () => {
    const then = new Date(message.updatedAt)
    const now = new Date()
    const difference = Math.abs(then.getTime() - now.getTime())
    const hours = difference / (60 * 60 * 1000)
    const currentYear = now.getFullYear()
    const messageYear = then.getFullYear()
    let timestamp = ""

    if (hours < 24) {
      timestamp = `Today at ${dayjs(message.updatedAt).format("h:mm A")}`
    } else {
      if (currentYear === messageYear) {
        timestamp = dayjs(message.updatedAt).format("MMM D, h:mm A")
      } else {
        timestamp = dayjs(message.updatedAt).format("MMM D, YYYY h:mm A")
      }
    }

    return timestamp
  }

  return (
    <li className="mb-2 flex w-full flex-row rounded-lg bg-slate-200 p-3 dark:bg-slate-900">
      <div className="mr-4">
        <div className="h-10 w-10 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
      </div>
      <div className="flex w-11/12 flex-col">
        <span className="font-bold">
          {/* {data && !loading ? data : message?.sender.substring(0, 8) + "..."} */}
          {message?.sender.substring(0, 8) + "..."}
        </span>
        <div>{message?.body}</div>
        <div className="mt-2 text-xs font-thin">{diffTimestap()}</div>
      </div>
    </li>
  )
}

export default MessageCard

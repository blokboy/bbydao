import dayjs from "dayjs"
import React from "react"
// import { useEnsLookup } from "wagmi"

const MessageCard = ({ message }) => {
  // causes a lot of requests when loading messages
  // const [{ data, error, loading }, lookupAddress] = useEnsLookup({
  //   address: message?.sender,
  // })

  // timestamp that prints out diff from current time
  const diffTimestamp = () => {
    const date = dayjs(message?.updatedAt)
    const now = dayjs()
    const diff = now.diff(date, "minute")
    const hour = 60
    const day = 24
    const week = 7
    const month = 30
    const year = 365

    const times = [
      [1, '', `just now`],
      [hour, diff, `minutes ago`],
      [hour * day, Math.round(diff / hour), `hours ago`],
      [hour * day * week, Math.round(diff / hour / day), `days ago`],
      [hour * day * month, Math.round(diff / hour / day / week), `weeks ago`],
      [hour * day * year, Math.round(diff / hour / day / month), `months`]
    ]

    for (const time of times) {
      const unit =time[1]
      if(diff < time[0]) {
        if(unit === 1) {
          return `${unit} ${time[2].replace("s", "")}`
        }
        return `${unit} ${time[2]}`
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
        <div className="mt-3 text-sm font-thin">{diffTimestamp()}</div>
      </div>
    </li>
  )
}

export default MessageCard

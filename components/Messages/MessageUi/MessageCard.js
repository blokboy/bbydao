import dayjs                       from "dayjs"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState }         from "react"
import { HiOutlineEmojiHappy } from "react-icons/hi"
import { MdAddReaction } from "react-icons/md"
import { Picker } from "emoji-mart"


// import { useEnsLookup } from "wagmi"

const MessageCard = ({ message }) => {
  // causes a lot of requests when loading messages
  // const [{ data, error, loading }, lookupAddress] = useEnsLookup({
  //   address: message?.sender,
  // })

  // timestamp that prints out diff from current time
  const diffTimeStamp = () => {
    const date = dayjs(message?.updatedAt)
    const now = dayjs()
    const minutesSince = now.diff(date, "minute")
    const hour = 60
    const day = 24
    const week = 7
    const month = 30
    const year = 365
    const minutesIn = {
      hour: hour,
      day: hour * day,
      week: hour * day * week,
      month: hour * day * month,
      year: hour * day * year
    }

    const stamps = [
      {
        expirationInMinutes: 1,
        timeSince: "",
        timeAgo: "just now"
      },
      {
        expirationInMinutes: minutesIn.hour,
        timeSince: minutesSince,
        timeAgo: `minutes ago`
      },
      {
        expirationInMinutes: minutesIn.day,
        timeSince: Math.round(minutesSince / hour),
        timeAgo: `hours ago`
      },
      {
        expirationInMinutes: minutesIn.week,
        timeSince: Math.round(minutesSince / hour / day),
        timeAgo: `days ago`
      },
      {
        expirationInMinutes: minutesIn.month,
        timeSince: Math.round(minutesSince / hour / day / week),
        timeAgo: `weeks ago`
      },
      {
        expirationInMinutes: minutesIn.year,
        timeSince: Math.round(minutesSince / hour / day / month),
        timeAgo: `months`
      },
      {
        expirationInMinutes: minutesIn.year * 1000,
        timeSince: Math.round(minutesSince / hour / day / month),
        timeAgo: `years`
      }
    ]

    for (const stamp of stamps) {
      if (minutesSince < stamp.expirationInMinutes) {
        return `${stamp.timeSince} ${stamp.timeSince === 1 ? stamp.timeAgo.replace("s", "") : stamp.timeAgo}`
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

  const handleMouseEnter = () => {
    setIsActive(true)
  }

  const handleMouseLeave = () => {
    setIsActive(false)
  }

  const [isActive, setIsActive] = useState(false)
  const variants = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        delay: .125
      }
    },
    exit: {
      opacity: 0
    }
  }
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const handleShowEmojiPicker = () => {

    // setShowEmojiPicker(!showEmojiPicker)
  }
  // const emojiPicker = () =>
  //   <Picker
  //     onSelect={handleEmojiClick}
  //     theme={theme === "dark" ? "dark" : "light"}
  //     emoji="desert_island"
  //     title=""
  //     native={true}
  //   />

  return (
    <li
      className="relative mb-2 flex w-full flex-row rounded-lg bg-slate-200 hover:bg-slate-100 p-3 dark:bg-slate-900 dark:hover:bg-slate-800"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      <AnimatePresence>
        <motion.div
          variants={variants}
          initial="initial"
          animate={isActive ? "animate" : "exit"}
          exit="exit"
          className="absolute right-4 bg-slate-300 p-2 rounded"
        >
          <button
            className="ml-3 flex items-center rounded-full border bg-slate-200 p-1 font-bold shadow-xl hover:bg-slate-100 focus:outline-none dark:bg-slate-700 dark:hover:bg-slate-600"
            type="button"
            onClick={handleShowEmojiPicker}
          >
            <MdAddReaction size={16} />
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="mr-4">
        <div className="h-10 w-10 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
      </div>
      <div
        className="flex w-11/12 flex-col"
      >
        <span className="font-bold">
          {/* {data && !loading ? data : message?.sender.substring(0, 8) + "..."} */}
          {message?.sender.substring(0, 8) + "..."}
        </span>
        <div>{message?.body}</div>
        <div className="mt-3 text-sm font-thin">{diffTimeStamp()}</div>
      </div>
    </li>
  )
}

export default MessageCard

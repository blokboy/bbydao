import dayjs                       from "dayjs"
import { Emoji, Picker }           from "emoji-mart"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState }         from "react"
import { MdAddReaction }           from "react-icons/md"


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
    setIsPickerActive(false)
  }

  const [isActive, setIsActive] = useState(false)
  const [isPickerActive, setIsPickerActive] = useState(false)

  const variants = {
    initial: {
      y: 3,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    exit: {
      y: 3,
      opacity: 0
    }
  }
  const pickerVariants = {
    initial: {
      height: 0,
      opacity: 0
    },
    animate: {
      height: "auto",
      pointerEvents: "auto",
      opacity: 1
    },
    exit: {
      display: "none",
      pointerEvents: "none"
    }
  }

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
          className="flex items-center absolute right-4 bg-slate-300 rounded border border-slate-400"
        >
          <span className="flex p-1">
            <Emoji
              emoji={{ id: "heart", skin: 3 }}
              size={16}
              onClick={() => {
                console.log("react")
              }}
              onOver={(emoji, event) => {
              }}
              onLeave={(emoji, event) => {
              }}
            />
          </span>
          <span
            onClick={() => {
              console.log("set emoji picker")
              setIsPickerActive(true)
            }}
            className="flex p-1 cursor-pointer"
          >
            <MdAddReaction size={16} />
          </span>
          {console.log("aaa", isPickerActive)}
          <motion.div
            variants={pickerVariants}
            initial="initial"
            animate={isPickerActive ? "animate" : "exit"}
            exit="exit"
            className="absolute bottom-8 right-0 z-99 pointer-events-none"
          >
            <Picker />
          </motion.div>
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

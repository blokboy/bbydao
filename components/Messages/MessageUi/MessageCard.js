import dayjs                                  from "dayjs"
import { Emoji, Picker }                      from "emoji-mart"
import { AnimatePresence, motion }            from "framer-motion"
import { useTheme }                           from "next-themes"
import * as api                               from "query"
import React, { useEffect, useRef, useState } from "react"
import { isMobile }                           from "react-device-detect"
import { MdAddReaction }                      from "react-icons/md"
import { useMutation }                        from "react-query"
import { walletSnippet }                      from "utils/helpers"

// import { useEnsLookup } from "wagmi"

const MessageCard = ({ message }) => {
  const { theme, setTheme } = useTheme()
  // timestamp that prints out diff from current time
  const diffTimeStamp = () => {
    const date = dayjs(message?.createdAt)
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
  const pickerWrapperRef = useRef(null)
  const pickerRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {

  }, [pickerRef])


  const {
    data,
    error,
    mutateAsync: updateMessage
  } = useMutation(api.mutateMessage, {

  })

  const handleEmojiReaction = (emoji) => {
    const req = {
      id: message.id,
      reactions: {
        [message.sender]: emoji
      }
    }

    updateMessage(
      data?.reactions?.[message.sender].id === emoji.id
        ? { id: message.id, reactions: null }
        : req
    )
  }

  return (
    <li
      className="relative mb-2 flex w-full flex-row rounded-lg bg-slate-200 hover:bg-slate-100 p-3 dark:bg-slate-900 dark:hover:bg-slate-800"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
      ref={cardRef}
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
              onClick={(emoji, event) => {
                handleEmojiReaction(emoji)
              }}
            />
          </span>
          <span
            onClick={() => {
              setIsPickerActive(true)

            }}
            className="flex p-1 cursor-pointer"
          >
            <MdAddReaction size={16} />
          </span>
          {!isMobile && (
            <div ref={pickerWrapperRef}>
              <motion.div
                variants={pickerVariants}
                initial="initial"
                animate={isPickerActive ? "animate" : "exit"}
                exit="exit"
                className="absolute bottom-0 right-14 z-99 pointer-events-none"
              >
                <Picker
                  ref={pickerRef}
                  theme={theme}
                  onSelect={(emoji) => {
                    handleEmojiReaction(emoji)
                  }}
                />
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mr-4">
        <div className="h-10 w-10 rounded-full border border-white bg-slate-200 dark:bg-slate-900"></div>
      </div>
      <div className="flex w-11/12 flex-col">
        <div className="flex items-center">
          <span className="font-bold">
            {walletSnippet(message?.sender)}
          </span>
          <div className="pl-2 text-[.8rem] font-thin">
            {diffTimeStamp()}
          </div>
        </div>
        <div className="font-normal py-1">
          {message?.body}
        </div>
        <div className="inline-flex">
          {!!data?.reactions && Object.entries(data?.reactions).reduce(function(accumulator = [], currentValue) {
            const count = Object.entries(data?.reactions)?.filter(item => item[1].id === currentValue[1].id).length
            const emojiItem = {
              id: currentValue[1].id,
              skin: currentValue[1].skin,
              count
            }

            if (accumulator.filter(item => item.id === currentValue[1].id && item.skin === currentValue[1].skin) < 1)
              accumulator.push(emojiItem)

            return accumulator

          }, []).map((item) => {
            return (
              <div
                className="flex items-center bg-slate-900 px-3 py-1 rounded-full mr-1 hover:cursor-pointer"
                onClick={() => handleEmojiReaction({ id: item.id, skin: item.skin })}
              >
                <Emoji
                  emoji={{
                    id: item?.id,
                    skin: item?.skin
                  }}
                  size={16}
                />
                <div className="pl-1 text-white text-xs font-light">
                  {item.count}
                </div>
              </div>
            )
          })}
          {isMobile && (
            <span
              onClick={() => {
                setIsPickerActive(true)
              }}
              className="flex items-center bg-slate-100 sm:bg-slate-200 px-3 py-1 rounded-full mr-1"
            >
              <MdAddReaction size={16} />
              <div ref={pickerWrapperRef}>
                <motion.div
                  variants={pickerVariants}
                  initial="initial"
                  animate={isPickerActive ? "animate" : "exit"}
                  exit="exit"
                  className="absolute bottom-8 right-0 z-99 pointer-events-none"
                >
                  <Picker
                    ref={pickerRef}
                    theme={theme}
                    onSelect={(emoji) => {
                      handleEmojiReaction(emoji)
                    }}
                  />
                </motion.div>
             </div>
            </span>
          )}
        </div>
      </div>
    </li>
  )
}

export default MessageCard

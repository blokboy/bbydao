import dayjs                                  from "dayjs"
import { useTheme }                           from "next-themes"
import * as api                               from "query"
import React, { useEffect, useRef, useState } from "react"
import { isMobile }                           from "react-device-detect"
import { useMutation }                        from "react-query"
import { walletSnippet }                      from "utils/helpers"
import EmojiButton                            from "./EmojiButton"
import MobileEmojiPickerButton                from "./MobileEmojiPickerButton"
import ReactionBar                            from "./ReactionBar"

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
  const [reactions, setReactions] = useState(message.reactions)

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

  const {
    data,
    error,
    mutateAsync: updateMessage
  } = useMutation(api.mutateMessage, {
    onSuccess: (e) => {
      setReactions(e?.reactions)
    }
  })


  const handleEmojiReaction = (emoji) => {
    const req = {
      id: message.id,
      reactions: {
        [message.sender]: emoji
      }
    }
    updateMessage(
      data?.reactions?.[message.sender]?.id === emoji.id
        ? {
            // Not sure if we are achieving removing a reaction in a different way?
            id: message.id,
            reactions: {
              [message.sender]: null
            }
      }
        : req
    )
  }

  return (
    <li
      className="relative mb-2 flex w-full flex-row rounded-lg bg-slate-200 hover:bg-slate-100 p-3 dark:bg-slate-900 dark:hover:bg-slate-800"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      {!isMobile && (
        <ReactionBar
          isActive={isActive}
          handleEmojiReaction={handleEmojiReaction}
          theme={theme}
          pickerVariants={pickerVariants}
          variants={variants}
          setIsPickerActive={setIsPickerActive}
          isPickerActive={isPickerActive}
        />
      )}

      <div className="mr-4">
        <div className="h-10 w-10 rounded-full border border-white bg-slate-200 dark:bg-slate-900" />
      </div>
      <div className="flex w-11/12 flex-col">
        <div className="flex items-center">
          <span
            className="font-bold"
            children={walletSnippet(message?.sender)}
          />
          <div
            className="pl-2 text-[.8rem] font-thin"
            children={diffTimeStamp()}
          />
        </div>
        <div className="font-normal py-1">
          {message?.body}
        </div>
        <div className="inline-flex">
          {!!reactions[message?.sender] && Object.entries(reactions).reduce(function(accumulator = [], currentValue) {
            const count = Object.entries(reactions)?.filter(item => item[1]?.id === currentValue[1].id).length
            const emojiItem = {
              id: currentValue[1].id,
              skin: currentValue[1].skin,
              count
            }

            if (accumulator.filter(item => item.id === currentValue[1].id && item.skin === currentValue[1].skin) < 1)
              accumulator.push(emojiItem)

            return accumulator

          }, []).map((emoji) => {
            return (
              <EmojiButton
                emoji={emoji}
                handleEmojiReaction={handleEmojiReaction}
                them={theme}
                key={emoji.id}
              />
            )
          })}
          {isMobile && (
            <MobileEmojiPickerButton
              theme={theme}
              pickerVariants={pickerVariants}
              handleEmojiReaction={handleEmojiReaction}
              setIsPickerActive={setIsPickerActive}
              isPickerActive={isPickerActive}
            />
          )}
        </div>
      </div>
    </li>
  )
}

export default MessageCard

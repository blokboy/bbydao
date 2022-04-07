import dayjs                   from "dayjs"
import { useTheme }            from "next-themes"
import * as api                from "query"
import React, { useState }     from "react"
import { isMobile }            from "react-device-detect"
import { useMutation }         from "react-query"
import { walletSnippet }       from "utils/helpers"
import { useAccount }          from "wagmi"
import EmojiButton             from "./EmojiButton"
import MobileEmojiPickerButton from "./MobileEmojiPickerButton"
import ReactionBar             from "./ReactionBar"

const MessageCard = ({ message }) => {
  const [isActive, setIsActive] = useState(false)
  const [isPickerActive, setIsPickerActive] = useState(false)
  const [reactions, setReactions] = useState(message.reactions)
  const { theme } = useTheme()
  const [{ data: accountData }] = useAccount()

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

  const handleMouseEnter = () => {
    setIsActive(true)
  }

  const handleMouseLeave = () => {
    setIsActive(false)
    setIsPickerActive(false)
  }

  const {
    mutateAsync: updateMessage
  } = useMutation(api.mutateMessage, {
    onSuccess: (e) => {
      setReactions(e?.reactions)
    }
  })

  const handleEmojiReaction = (emoji) => {
    const alreadyExists = reactions?.[accountData?.address]?.id === emoji.id
    const req = {
      id: message.id,
      reactions: {
        ...reactions,
        [accountData?.address]: !alreadyExists ? emoji : null
      }
    }

    /* prevent unconnected account from reacting */
    if (!!accountData?.address)
      updateMessage(req)
  }

  const reducedReactions = React.useMemo(() => {
    return reactions !== null && Object.entries(reactions).reduce(function(accumulator = [], currentValue) {
      const count = Object.entries(reactions)?.filter(item => item[1]?.id === currentValue[1]?.id).length
      const emojiItem = {
        id: currentValue[1]?.id,
        skin: currentValue[1]?.skin,
        count
      }

      if (accumulator.filter(item => item.id === currentValue?.[1]?.id && item.skin === currentValue?.[1]?.skin) < 1 && currentValue?.[1] !== null)
        accumulator.push(emojiItem)


      return accumulator

    }, [])
  }, [reactions])

  return (
    <li
      className="relative mb-2 flex w-full flex-row rounded-lg bg-slate-200 p-3 dark:bg-slate-900"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
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
        <div
          className="font-normal py-1"
          children={message?.body}
        />
        <div className="inline-flex">
          {reducedReactions?.map((emoji) => {
            return (
              <EmojiButton
                emoji={emoji}
                handleEmojiReaction={handleEmojiReaction}
                them={theme}
                key={emoji.id}
              />
            )
          })}
          {(isMobile && (
            <MobileEmojiPickerButton
              theme={theme}
              handleEmojiReaction={handleEmojiReaction}
              setIsPickerActive={setIsPickerActive}
              isPickerActive={isPickerActive}
            />
          ) || (
            <ReactionBar
              isActive={isActive}
              handleEmojiReaction={handleEmojiReaction}
              theme={theme}
              setIsPickerActive={setIsPickerActive}
              isPickerActive={isPickerActive}
            />
          ))}
        </div>
      </div>
    </li>
  )
}

export default MessageCard

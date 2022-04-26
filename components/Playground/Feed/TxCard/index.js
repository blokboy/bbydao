import React from "react"
import Link from "next/link"
import dayjs from "dayjs"

// currently renders only one uniform tx card
// break up into multi_sig, eth_tx, etc. 
// style uniquely to differentiate them from each other
// will give users a good sense of how active a dao is and the types of txs that are occurring
// i think TxCards should be expandable in some way
// multi_sig txs in particular, an expanded view would be useful to display more info / actions on that tx
const TxCard = ({ tx }) => {
  console.log("TxCard tx:", tx)

  const diffTimeStamp = () => {
    const date = dayjs(tx?.executionDate || tx?.submissionDate)
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
      year: hour * day * year,
    }

    const stamps = [
      {
        expirationInMinutes: 1,
        timeSince: "",
        timeAgo: "just now",
      },
      {
        expirationInMinutes: minutesIn.hour,
        timeSince: minutesSince,
        timeAgo: `minutes ago`,
      },
      {
        expirationInMinutes: minutesIn.day,
        timeSince: Math.round(minutesSince / hour),
        timeAgo: `hours ago`,
      },
      {
        expirationInMinutes: minutesIn.week,
        timeSince: Math.round(minutesSince / hour / day),
        timeAgo: `days ago`,
      },
      {
        expirationInMinutes: minutesIn.month,
        timeSince: Math.round(minutesSince / hour / day / week),
        timeAgo: `weeks ago`,
      },
      {
        expirationInMinutes: minutesIn.year,
        timeSince: Math.round(minutesSince / hour / day / month),
        timeAgo: `months ago`,
      },
      {
        expirationInMinutes: minutesIn.year * 1000,
        timeSince: Math.round(minutesSince / hour / day / month),
        timeAgo: `years ago`,
      },
    ]

    for (const stamp of stamps) {
      if (minutesSince < stamp.expirationInMinutes) {
        return `${stamp.timeSince} ${stamp.timeSince === 1 ? stamp.timeAgo.replace("s", "") : stamp.timeAgo}`
      }
    }
  }

  return (
    <div className="flex md:flex-row flex-col dark:bg-slate-800 bg-slate-200 space-x-2 rounded-xl p-3">
      <div className="rounded-full h-16 w-16 border border-white"></div>
      <div className="flex flex-col">
        <div className="text-xl">{tx?.txType}</div>
        <div className="text-sm">{diffTimeStamp()}</div>
        {tx?.txHash ? <Link href={`https://etherscan.io/tx/${tx?.txHash}`} passHref>
          <a target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400">view on etherscan</a>
        </Link> : null}
        </div>
    </div>
  )
}

export default TxCard

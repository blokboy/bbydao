import React from "react"
import { useBalance } from "wagmi"

const DaoBalance = ({ safe }) => {
  const [{ data, error, loading }, getBalance] = useBalance({
    addressOrName: safe,
  })

  return (
    <div className="flex flex-row space-x-2 px-2 text-xl">
      {loading ? (
          <div className="flex h-7 w-full flex-row items-start justify-start">
            <div className="flex h-full w-44 animate-pulse rounded-xl bg-slate-300 dark:bg-slate-900"></div>
          </div>
      ):(
        <>
          <div>{data?.formatted.substring(0,8)}</div>
          <div>ETH</div>
        </>
      )}

    </div>
  )
}

export default DaoBalance

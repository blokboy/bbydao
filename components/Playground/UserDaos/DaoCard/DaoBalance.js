import React from "react"
import { useBalance } from "wagmi"

const DaoBalance = ({ safe }) => {
  const [{ data, error, loading }, getBalance] = useBalance({
    addressOrName: safe,
  })

  return (
    <div className="flex flex-row space-x-2 text-xl">
      <div>{data?.formatted.substring(0,8)}</div>
      <div>ETH</div>
    </div>
  )
}

export default DaoBalance

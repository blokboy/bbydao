import React from "react"
import { FaEthereum } from "react-icons/fa"
import { HiDotsHorizontal } from "react-icons/hi"

const TokenCard = ({ token, i }) => {
  return (
    <div key={i} className="flex w-full flex-row items-center justify-between rounded-xl bg-slate-100 p-2 dark:bg-slate-700">
      <div className="flex flex-row space-x-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-clip rounded-full border border-white">
          {token?.token?.logoUri ? <img src={token?.token?.logoUri} alt={i} /> : <FaEthereum size={30} />}
        </div>
        {/* <div>{token?.token?.symbol ? token?.token?.symbol : "ETH"}</div> */}
        <div className="flex h-full flex-col rounded-xl bg-slate-200 p-1 text-xs dark:bg-slate-600">
          <span>
            {(token?.balance / 10 ** 18).toFixed(3)} {token.token?.symbol ? token.token.symbol : "ETH"}
          </span>
          <span className="text-teal-600 dark:text-teal-400">${Number(token?.fiatBalance).toFixed(2)}</span>
        </div>
      </div>
      <div className="flex">
        <button className="flex rounded-lg border border-white p-1">
          <HiDotsHorizontal />
        </button>
      </div>
    </div>
  )
}

export default TokenCard

import React from "react"

const TokenBalance = ({ token }) => (
  <div className="flex h-full w-auto flex-col p-2">
    <span className="text-sm font-thin">
      {(token?.balance / 10 ** 18).toFixed(3)} {token.symbol}
    </span>
    <span className="text-xs font-thin text-teal-600 dark:text-teal-400">${Number(token?.fiatBalance).toFixed(2)}</span>
  </div>
)

export default TokenBalance

import React from "react"
import TokenCard from './TokenCard';

const DaoTokensTab = ({ tokens }) => {

  return (
    <div className="flex flex-col">
      <div className="text-xl">tokens</div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 py-2">
        {tokens?.map((token, i) => <TokenCard token={token} key={i} />)}
      </div>
    </div>
  )
}

export default DaoTokensTab

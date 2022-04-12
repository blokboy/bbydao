import React from "react"
import Tokens from "./Tokens"
import Nfts from "./Nfts"
import Graph from "../Graph"

const TokensNfts = ({ tokens, collectibles, safeAddress }) => {
  return (
    <div className="mx-2 mb-3 flex flex-col rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      <Graph tokens={tokens} safeAddress={safeAddress}/>
      <Tokens tokens={tokens} />
      <Nfts collectibles={collectibles} />
    </div>
  )
}

export default TokensNfts

import React from "react"
import Tokens from "./Tokens"
import Nfts from "./Nfts"

const TokensNfts = ({ tokens, collectibles }) => {
  return (
    <div className="mx-2 mb-3 flex flex-col rounded-xl bg-slate-200 p-3 shadow-xl dark:bg-slate-900">
      <Tokens tokens={tokens} />
      <Nfts collectibles={collectibles} />
    </div>
  )
}

export default TokensNfts

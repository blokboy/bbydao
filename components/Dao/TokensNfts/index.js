import React from "react"
import Tokens from "./Tokens"
import Nfts from "./Nfts"

const TokensNfts = ({ tokens, collectibles }) => {
  return (
    <div className="mx-auto mb-3 flex w-1/2 flex-col rounded-xl bg-slate-200 px-4 pt-6 pb-8 shadow-xl dark:bg-slate-900">
      <Tokens tokens={tokens} />
      <Nfts collectibles={collectibles} />
    </div>
  )
}

export default TokensNfts

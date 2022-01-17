import React from "react"
import Tokens from "./Tokens"
import Nfts from "./Nfts"

const TokensNfts = ({ tokens, collectibles }) => {
  return (
    <div className="flex flex-col mx-auto rounded shadow-xl w-full md:rounded-xl px-8 pt-6 pb-8 mb-3 bg-slate-100 dark:bg-slate-900">
      <Tokens tokens={tokens} />
      <Nfts collectibles={collectibles} />
    </div>
  )
}

export default TokensNfts

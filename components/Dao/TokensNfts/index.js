import React from "react"
import Tokens from "./Tokens"
import Nfts from "./Nfts"

const TokensNfts = ({ tokens, collectibles }) => {
  return (
    <div className="flex flex-col mx-auto rounded-xl shadow-xl w-full px-4 pt-6 pb-8 mb-3 bg-slate-200 dark:bg-slate-900">
      <Tokens tokens={tokens} />
      <Nfts collectibles={collectibles} />
    </div>
  )
}

export default TokensNfts

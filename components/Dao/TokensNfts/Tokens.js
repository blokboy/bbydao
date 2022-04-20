import React from "react"
import TokenCard from "./TokenCard"
import { tokenList } from "ABIs/tokens"
import { ChainId, Token, WETH, Pair, TokenAmount } from "@uniswap/sdk"

const Tokens = ({ tokens }) => {
  // token container for token list
  return (
    <div className="flex flex-col space-y-2">
      Tokens:
      {tokens &&
        tokens.map(token => {
          return <TokenCard token={token} key={token.tokenAddress} />
        })}
    </div>
  )
}

export default Tokens

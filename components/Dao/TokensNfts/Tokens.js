import React from "react"
import TokenCard from "./TokenCard"
import { tokenList } from "ABIs/tokens"
import { ChainId, Token, WETH, Pair, TokenAmount } from "@uniswap/sdk"

const Tokens = ({ tokens }) => {
  return (
    <div>
      Tokens:
      {tokens &&
        tokens.map(token => {
          return <TokenCard token={token} />
        })}
    </div>
  )
}

export default Tokens

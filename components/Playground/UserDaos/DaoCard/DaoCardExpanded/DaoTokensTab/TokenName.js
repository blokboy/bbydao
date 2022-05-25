import React from "react"

const TokenName = ({ token, isUniV2 }) => {
  return (
    <span className="text-xl font-normal">
      {(isUniV2 && <>{token.name.replace("Uniswap V2", "").replace("Pool", "LP")}</>) || (
        <>{token.name ? token.name : "Ethereum"}</>
      )}
    </span>
  )
}

export default TokenName

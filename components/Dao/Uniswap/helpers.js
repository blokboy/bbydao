import React from "react"

/*  decimal integer  */
//TODO: can probably uses BigNumber for this
export const amount = (amount, decimals) => Math.round(amount * 10 ** (decimals || 18)).toString()


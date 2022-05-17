import { TokenAmount } from "@uniswap/sdk"
import { BigNumber, ethers } from "ethers"
import { formatUnits } from "ethers/lib/utils"

/*  decimal integer  */
//TODO: can probably uses BigNumber for this
export const amount = (amount, decimals) => Math.round(amount * 10 ** (decimals || 18)).toString()



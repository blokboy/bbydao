import { ethers } from "ethers"
import React from "react"
import { useQueryClient } from "react-query"
import { useSigner } from "wagmi"
import { minimalABI } from "hooks/useERC20Contract"
import { NumberFromBig } from "utils/helpers"

const Send = ({ token }) => {
  const { data: signer } = useSigner()
  // const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  // const [hasAllowance, setHasAllowance] = React.useState()
  // const queryClient = useQueryClient()
  // const bbyDao = queryClient.getQueryData("expandedDao")

  /*
   *
   * Allowance Check:
   *
   * Check whether the spender (uniswapV2Router02) is allowed to
   * spend (TransferFrom) the two Tokens that compose the Pair
   * on behalf of the owner (bbyDao).
   *
   * */
  // const tokenContract = React.useMemo(async () => {
  //   try {
  //     let token0Contract, token1Contract, token0AllowanceAmount, token1AllowanceAmount
  //
  //     if (!!signer && !!token) {
  //       token0Contract = new ethers.Contract(token?.address, minimalABI, signer)
  //       const allowance = await token0Contract.allowance(bbyDao, UniswapV2Router02)
  //       token0AllowanceAmount = await NumberFromBig(allowance?._hex, token.decimals)
  //         console.log('to', token0Contract, allowance)
  //     }
  //
  //     return {
  //       contracts: [token0Contract],
  //       allowedToSpend: { token0: token0AllowanceAmount > 0 },
  //     }
  //   } catch (err) {
  //     console.log("err", err)
  //   }
  // }, [token])
  // React.useMemo(async () => {
  //   try {
  //     const allowed = await tokenContract
  //     setHasAllowance({ ...hasAllowance, ...allowed?.allowedToSpend })
  //   } catch (err) {
  //     console.log("err", err)
  //   }
  // }, [tokenContract])

  return (
      <div>
          <div>
              hi
          </div>
      </div>
  )
}

export default Send

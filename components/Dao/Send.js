import { BigNumber, ethers } from "ethers"
import React from "react"
import { useQueryClient } from "react-query"
import { useSigner } from "wagmi"
import { minimalABI } from "hooks/useERC20Contract"
import { max256, NumberFromBig } from "utils/helpers"
import useForm from "../../hooks/useForm"
import useGnosisTransaction from "../../hooks/useGnosisTransaction"
import TokenInput from "./Uniswap/TokenInput"

const Send = ({ token }) => {
  const { data: signer } = useSigner()
  const UniswapV2Router02 = ethers.utils.getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
  const [hasAllowance, setHasAllowance] = React.useState()
  const queryClient = useQueryClient()
  const bbyDao = queryClient.getQueryData("expandedDao")
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const ref = React.useRef()
  const { state, setState, handleChange } = useForm()

  /*
   * Approve Tokens:
   *
   * Send a gnosis transaction to allow the spender (uniswapV2Router02)
   * to spend the token being approved on behalf of the owner (bbyDao)
   *
   * */
  const handleApproveToken = async (tokenContract, index) => {
    try {
      const contracts = await tokenContract
      const contract = await contracts.contracts[index]
      const tx = gnosisTransaction(
        {
          abi: minimalABI,
          instance: contract,
          fn: "approve(address,uint256)",
          args: {
            spender: bbyDao,
            value: BigNumber.from(max256),
          },
        },
        contract?.address,
        0
      )
      console.log("tx", tx)
    } catch (err) {
      console.log("err", err)
    }
  }

  /*
   *
   * Allowance Check:
   *
   * Check whether the spender (uniswapV2Router02) is allowed to
   * spend (TransferFrom) the two Tokens that compose the Pair
   * on behalf of the owner (bbyDao).
   *
   * */
  const tokenContract = React.useMemo(async () => {
    try {
      let token0Contract, token0AllowanceAmount

      if (!!signer && !!token) {
        token0Contract = new ethers.Contract(token?.address, minimalABI, signer)
        console.log("to", token0Contract)
        const allowance = await token0Contract.allowance(bbyDao, UniswapV2Router02)
        token0AllowanceAmount = await NumberFromBig(allowance?._hex, token.decimals)
      }

      return {
        contracts: [token0Contract],
        allowedToSpend: { token0: token0AllowanceAmount > 0 },
      }
    } catch (err) {
      console.log("err", err)
    }
  }, [token, bbyDao, signer])
  React.useMemo(async () => {
    try {
      const allowed = await tokenContract
      setHasAllowance({ ...hasAllowance, ...allowed?.allowedToSpend })
    } catch (err) {
      console.log("err", err)
    }
  }, [tokenContract])

  const handleSetTokenValue = async (e, token, tokenRef) => {
    const token0Input = tokenRef?.current?.max

    setState(state => ({ ...state, [token?.symbol]: token0Input }))
  }

  const handleSetMaxTokenValue = async (token, tokenRef) => {
    const token0Input = tokenRef?.current?.max

    setState(state => ({ ...state, [token?.symbol]: token0Input }))
  }

  return (
    <div>
      <TokenInput
        lpToken={token}
        isSend={true}
        tokenInputRef={ref}
        handleSetTokenValue={handleSetTokenValue}
        handleSetMaxTokenValue={handleSetMaxTokenValue}
        state={state}
      />
      {hasAllowance?.token0 === false && (
        <div
          className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
          onClick={() => handleApproveToken(tokenContract, 0)}
        >
          Approve {token?.symbol}
        </div>
      )}
    </div>
  )
}

export default Send

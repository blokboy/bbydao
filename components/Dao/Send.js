import { BigNumber, ethers } from "ethers"
import React from "react"
import { useQueryClient } from "react-query"
import { useSigner } from "wagmi"
import { minimalABI } from "hooks/useERC20Contract"
import { max256, NumberFromBig } from "utils/helpers"
import useCalculateFee from "hooks/useCalculateFee"
import useForm from "hooks/useForm"
import useGnosisTransaction from "hooks/useGnosisTransaction"
import TokenInput from "./Uniswap/TokenInput"

const Send = ({ token }) => {
  const { data: signer } = useSigner()
  const [hasAllowance, setHasAllowance] = React.useState()
  const queryClient = useQueryClient()
  const bbyDao = queryClient.getQueryData("expandedDao")
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const ref = React.useRef()
  const { state, setState, handleChange } = useForm()
  const { calculateFee } = useCalculateFee()

  /*
   * Approve Token:
   *
   * Send a gnosis transaction to allow the spender (token)
   * spend the token being approved on behalf of the owner (bbyDao)
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
            spender: token?.address,
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
   * Check whether the spender (token Contract) is allowed to
   * spend (TransferFrom) the token of the owner (bbyDao).
   *
   * */
  const tokenContract = React.useMemo(async () => {
    try {
      let token0Contract, token0AllowanceAmount

      if (!!signer && !!token) {
        token0Contract = new ethers.Contract(token?.address, minimalABI, signer)
        const allowance = await token0Contract.allowance(bbyDao, token?.address)
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

  const handleSetMaxTokenValue = async (token, tokenRef) => {
    const token0Input = tokenRef?.current?.max

    setState(state => ({ ...state, [token?.symbol]: token0Input }))
  }

  const handleSetTokenValue = async (e, token, tokenRef) => {
    const token0Input = e?.target?.valueAsNumber
    const bal = token?.balance
    const dec = token?.decimals
    const max = bal / 10 ** dec

    if (token0Input > max) {
      await handleSetMaxTokenValue(token, tokenRef)
    } else {
      setState(state => ({ ...state, [token.symbol]: token0Input }))
    }
  }

  const handleSendTokens = async args => {
    const contract = await tokenContract
    const value = ethers.utils.parseUnits(args.value.toFixed(6).toString(), token?.decimals)
    const { recipient } = args
    console.log('tokesn', token)

    const tx = gnosisTransaction(
      {
        abi: minimalABI,
        instance: contract.contracts[0],
        fn: "transferFrom(address,address,uint256)",
        args: {
          sender: bbyDao,
          recipient,
          value,
        },
      },
      contract.contracts[0]?.address,
      0,
     await calculateFee([{ value, token }])
    )
    console.log("tx", await calculateFee([{ value, token }]))
  }

  const prepare = React.useMemo(() => {
    let show = false
    let args = undefined
    if (ethers.utils.isAddress(state.recipient) && parseFloat(state?.[token?.symbol]) > 0) {
      show = true
      args = { recipient: ethers.utils.getAddress(state.recipient), value: parseFloat(state?.[token?.symbol]) }
    }

    return { show, args }
  }, [state])

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
      <div className="flex justify-center font-thin text-3xl items-center p-2">to</div>
      <form>
        <div className="flex w-full flex-col rounded-xl border bg-slate-100 p-4 hover:border-[#FC8D4D] dark:bg-slate-800">
          <div className="flex flex-row">
            <input
              onChange={handleChange}
              id="name"
              name="recipient"
              value={state?.recipient || ""}
              className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-4xl leading-tight focus:outline-none dark:bg-slate-800"
            />
          </div>
        </div>
      </form>
      {prepare?.show === true && !!prepare?.args && (
        <button
          type="button"
          className={`mt-8 flex w-full items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]`}
          onClick={() => handleSendTokens(prepare.args)}
        >
          Send Tokens
        </button>
      )}
      {hasAllowance?.token0 === false && token?.symbol !== "ETH" && (
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

import { BigNumber, ethers } from "ethers"
import React from "react"
import { HiCheckCircle } from "react-icons/hi"
import { minimalABI } from "hooks/useERC20Contract"
import { max256, NumberFromBig } from "utils/helpers"
import useForm from "hooks/useForm"
import useGnosisTransaction from "hooks/useGnosisTransaction"
import { useLayoutStore } from "stores/useLayoutStore"
import { usePlaygroundStore } from "stores/usePlaygroundStore"
import TokenInput from "./TokenInput"

const Send = ({ token }) => {
  const [hasAllowance, setHasAllowance] = React.useState()
  const bbyDao = usePlaygroundStore(state => state.expandedDao)
  const signer = useLayoutStore(state => state.signer)
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const ref = React.useRef()
  const { state, setState, handleChange } = useForm()

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
      console.log('hi')
      await handleSetMaxTokenValue(token, tokenRef)
    } else {
      setState(state => ({ ...state, [token.symbol]: token0Input }))
    }
  }

  const handleSendTokens = async args => {
    const contract = await tokenContract
    const value = ethers.utils.parseUnits(args.value.toFixed(6).toString(), token?.decimals)
    const { recipient } = args

    if (token.symbol === "ETH") {
      const tx = gnosisTransaction(
        {
          fn: "sendEth",
        },
        recipient,
        value
      )
    } else {
      const tx = gnosisTransaction(
        {
          abi: minimalABI,
          instance: contract.contracts[0],
          fn: "transfer(address,uint256)",
          args: {
            recipient,
            value,
          },
        },
        contract.contracts[0]?.address,
        0
      )
    }
  }

  const prepare = React.useMemo(() => {
    let show = false
    let args = undefined
    let validAddress = ethers.utils.isAddress(state.recipient)
    let hasBalance = parseFloat(state?.[token?.symbol]) > 0
    if (validAddress && hasBalance) {
      show = true
      args = { recipient: ethers.utils.getAddress(state.recipient), value: parseFloat(state?.[token?.symbol]) }
    }

    return { show, args, validAddress }
  }, [state])

  return (
    <div>
      <TokenInput
        token={token}
        isSend={true}
        tokenInputRef={ref}
        handleSetTokenValue={handleSetTokenValue}
        handleSetMaxTokenValue={handleSetMaxTokenValue}
        state={state}
        logo={token?.logoURI}
      />
      <div className="flex items-center justify-center p-2 text-3xl font-thin">to</div>
      <form>
        <div className="mb-8 flex w-full flex-col rounded-xl border bg-slate-100 p-4 hover:border-[#FC8D4D] dark:bg-slate-800">
          <div className="flex flex-row items-center">
            <input
              onChange={handleChange}
              id="name"
              name="recipient"
              value={state?.recipient || ""}
              className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-sm leading-tight focus:outline-none dark:bg-slate-800"
              placeholder={"Recipient Address"}
            />
            {prepare?.validAddress && <HiCheckCircle size={32} />}
          </div>
        </div>
      </form>
      {(hasAllowance?.token0 === true || token?.symbol === "ETH") && prepare?.show === true && !!prepare?.args && (
        <button
          type="button"
          className={`focus:shadow-outline flex h-16 w-full w-full
           appearance-none items-center justify-center rounded-full 
          bg-sky-500 py-2 px-3 text-xl font-normal leading-tight text-white hover:bg-sky-600 
          focus:outline-none dark:bg-orange-600 dark:hover:bg-orange-700`}
          onClick={() => handleSendTokens(prepare.args)}
        >
          Send Tokens
        </button>
      )}
      {hasAllowance?.token0 === false && token?.symbol !== "ETH" && (
        <button
          type="button"
          className={`focus:shadow-outline flex h-16 w-full w-full
           appearance-none items-center justify-center rounded-full 
          bg-sky-500 py-2 px-3 text-xl font-normal leading-tight text-white hover:bg-sky-600 
          focus:outline-none dark:bg-orange-600 dark:hover:bg-orange-700`}
          onClick={() => handleApproveToken(tokenContract, 0)}
        >
          Approve {token?.symbol}
        </button>
      )}
    </div>
  )
}

export default Send

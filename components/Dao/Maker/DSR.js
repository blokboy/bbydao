import { BigNumber, ethers } from "ethers"
import React from "react"
import useCalculateFee from "hooks/useCalculateFee"
import useForm from "hooks/useForm"
import useGnosisTransaction from "hooks/useGnosisTransaction"
import dsrABI from "ABIs/dsr.json"
import daiABI from "ABIs/dai.json"
import { minimalABI } from "hooks/useERC20Contract"
import { useLayoutStore } from "stores/useLayoutStore"
import { usePlaygroundStore } from "stores/usePlaygroundStore"
import { max256, NumberFromBig } from "utils/helpers"
import TokenInput from "../TokenInput"

const DSR = ({ token }) => {
  const ref = React.useRef()
  const [hasAllowance, setHasAllowance] = React.useState()
  const signer = useLayoutStore(state => state.signer)
  const bbyDao = usePlaygroundStore(state => state.expandedDao)
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const { calculateFee } = useCalculateFee()
  const DsrManager = ethers.utils.getAddress("0x373238337Bfe1146fb49989fc222523f83081dDb")
  const DaiAddress = ethers.utils.getAddress("0x6b175474e89094c44da98b954eedeac495271d0f")
  const { state, setState, handleChange } = useForm()
  const tokenInputRef = React.useRef()
  const slippage = 0.055

  const dsrContract = React.useMemo(() => {
    try {
      return new ethers.Contract(DsrManager, dsrABI, signer)
    } catch (err) {
      console.log("err", err)
    }
  }, [])

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
            spender: DsrManager,
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
  const daiContract = React.useMemo(async () => {
    try {
      let daiContract, daoAllowance

      if (!!signer && !!token) {
        daiContract = new ethers.Contract(DaiAddress, daiABI, signer)
        const allowance = await daiContract.allowance(bbyDao, DsrManager)
        daoAllowance = await NumberFromBig(allowance?._hex, token.decimals)
      }

      return {
        contracts: [daiContract],
        allowedToSpend: { token0: daoAllowance > 0 },
      }
    } catch (err) {
      console.log("err", err)
    }
  }, [token, bbyDao, signer])
  React.useMemo(async () => {
    try {
      const allowed = await daiContract
      setHasAllowance({ ...hasAllowance, ...allowed?.allowedToSpend })
    } catch (err) {
      console.log("err", err)
    }
  }, [daiContract])

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

  console.log('ds', bbyDao)

  const handleSaveDai = async value => {
    let tokenAmount = parseFloat(value?.toString()) - parseFloat(value.toString()) * slippage
    tokenAmount = ethers.utils.parseUnits(tokenAmount.toString(), token?.decimals)

    const tx = gnosisTransaction(
      {
        abi: dsrABI,
        instance: dsrContract,
        fn: "join(address,uint256)",
        args: {
          bbyDao,
          tokenAmount,
        },
      },
      DsrManager,
      0,
      await calculateFee([{ value: tokenAmount }])
    )
    console.log("tx", tx)
  }

  return (
    <div>
      <div className="my-2 mb-4 rounded-xl bg-[#eda67e24] p-4 font-thin text-[#FC8D4D]">
        The Dai Savings Rate (DSR) lets you earn interest by putting your Dai in <a href="https://makerdao.com/en/">Maker’s</a> DSR smart contract.
        The rate is set by the Maker community. They raise or lower it to influence demand for Dai, which in turn helps stabilise its value.
      </div>
      {token && (
        <TokenInput
          token={token}
          isEarn={true}
          tokenInputRef={ref}
          handleSetTokenValue={handleSetTokenValue}
          handleSetMaxTokenValue={handleSetMaxTokenValue}
          state={state}
          logo={token?.logoUri}
        />
      )}
      {hasAllowance?.token0 === false && token && (
        <div
          className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
          onClick={() => handleApproveToken(daiContract, 0)}
        >
          Approve {token?.symbol}
        </div>
      )}
      {hasAllowance?.token0 === true && state[token?.symbol] > 0 && (
        <button
          type="button"
          className={`mt-4 flex w-full items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]`}
          onClick={() => handleSaveDai(state[token?.symbol])}
        >
          Save DAI
        </button>
      )}
    </div>
  )
}

export default DSR

import { ethers } from "ethers"
import React, { useEffect } from "react"
import { useQueryClient } from "react-query"
import { useSigner } from "wagmi"
import useCalculateFee from "hooks/useCalculateFee"
import useForm from "hooks/useForm"
import useGnosisTransaction from "hooks/useGnosisTransaction"
import BancorStandardRewards from "ABIs/bancorStandardRewards.json"
import BancorPoolToken from "ABIs/bancorPoolToken.json"
import { useLayoutStore } from "../../../stores/useLayoutStore"
import { usePlaygroundStore } from "../../../stores/usePlaygroundStore"

import TokenInput from "../TokenInput"
import Slippage   from '../Slippage'

const Earn = ({ ethToken }) => {
  const signer = useLayoutStore(state => state.signer)
  const bbyDao = usePlaygroundStore(state => state.expandedDao)
  const { gnosisTransaction } = useGnosisTransaction(bbyDao)
  const { calculateFee } = useCalculateFee()
  const BancorStandardRewardsAddress = ethers.utils.getAddress("0xb0B958398ABB0b5DB4ce4d7598Fb868f5A00f372")
  const BancorNetworkSettingsAddress = ethers.utils.getAddress("0x83E1814ba31F7ea95D216204BB45FE75Ce09b14F")
  const { state, setState, handleChange } = useForm()
  const tokenInputRef = React.useRef()
  /* init slippage */
  const defaultSlippage = 0.005
  useEffect(() => {
    setState({ slippage: defaultSlippage * 100 })
  }, [])

  const rewardContract = React.useMemo(() => {
    try {
      return new ethers.Contract(BancorStandardRewardsAddress, BancorStandardRewards, signer)
    } catch (err) {
      console.log("err", err)
    }
  }, [])

  const bnETH = React.useMemo(async () => {
    try {
      let ids = await rewardContract?.programIds()
      let programs = await rewardContract?.programs(ids)
      const bnETH = programs?.[5]

      return {
        bnETH,
        poolToken: bnETH?.poolToken,
      }
    } catch (err) {
      console.log("err", err)
    }
  }, [rewardContract])

  // console.log('bn', bnETH)
  // depositAndJoin(6,uint256)

  /*
   *
   * Allowance Check:
   *
   * Check whether the spender (token Contract) is allowed to
   * spend (TransferFrom) the token of the owner (bbyDao).
   *
   * */
  // const tokenContract = React.useMemo(async () => {
  //   try {
  //     let token0Contract, token0AllowanceAmount
  //     let poolToken = (await bnETH).poolToken
  //
  //     if (!!signer && !!token) {
  //       token0Contract = new ethers.Contract(poolToken, BancorPoolToken, signer)
  //       const allowance = await token0Contract.allowance(bbyDao, token?.address)
  //       token0AllowanceAmount = await NumberFromBig(allowance?._hex, token.decimals)
  //     }
  //
  //     console.log('t', token0AllowanceAmount, token0Contract)
  //     return {
  //       contracts: [token0Contract],
  //       allowedToSpend: { token0: token0AllowanceAmount > 0 },
  //     }
  //   } catch (err) {
  //     console.log("err", err)
  //   }
  // }, [token, bbyDao, signer, bnETH])

  const handleDepositAndJoin = async value => {
    console.log("v", value)
    const slippage = state?.slippage / 100 || defaultSlippage
    let programId = 6
    let tokenAmount = parseFloat(value?.toString()) - parseFloat(value.toString()) * slippage
    tokenAmount = ethers.utils.parseUnits(tokenAmount.toFixed(6).toString(), ethToken?.decimals)

    const tx = gnosisTransaction(
      {
        abi: BancorStandardRewards,
        instance: rewardContract,
        fn: "depositAndJoin(uint256,uint256)",
        args: {
          programId,
          tokenAmount,
        },
      },
      BancorStandardRewardsAddress,
      tokenAmount,
      await calculateFee([{ value: tokenAmount }])
    )
    console.log("tx", tx)
  }

  const handleSetTokenValue = async (e, token, tokenRef) => {
    try {
      const bal = token?.balance
      const dec = token?.decimals
      const max = bal / 10 ** dec
      const token0Input = e?.target?.valueAsNumber

      if (token0Input > max) {
        handleSetMaxTokenValue(token, tokenRef)
      } else {
        setState(state => ({ ...state, [token.symbol]: token0Input }))
      }
    } catch (err) {
      console.log("err", err)
    }
  }

  const handleSetMaxTokenValue = async (token, tokenRef) => {
    const token0Input = tokenRef?.current?.max
    setState(state => ({ ...state, [token?.symbol]: token0Input }))
  }

  return (
    <div>
      <div className="my-2 mb-4 rounded-xl bg-[#eda67e24] p-4 font-thin text-[#FC8D4D]">
        Deposit a single token and maintain 100% upside exposure while earning fees and rewards.{" "}
        <a
          className="underline"
          href={
            "https://support.bancor.network/hc/en-us/articles/5415540047506-Auto-Compounding-Rewards-Standard-Rewards-programs"
          }
        >
          Read more about Bancor's auto-compounding Rewards program here.
        </a>
      </div>
      <TokenInput
        token={ethToken}
        logo={ethToken?.logoURI}
        handleSetTokenValue={handleSetTokenValue}
        handleSetMaxTokenValue={handleSetMaxTokenValue}
        state={state}
        tokenInputRef={tokenInputRef}
        isEarn={true}
      />
      {state[ethToken?.symbol] ? (
        <button
          type="button"
          className={`mt-4 flex w-full items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]`}
          onClick={() => handleDepositAndJoin(state[ethToken?.symbol])}
        >
          Deposit
        </button>
      ) : null}
      <Slippage value={state?.slippage} handleChange={handleChange} defaultSlippage={defaultSlippage * 100} setState={setState} />
    </div>
  )
}

export default Earn

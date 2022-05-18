import React from "react"
import { ethers, BigNumber } from "ethers"
import { minimalABI } from "hooks/useERC20Contract"
import { eToNumber, isEmpty, max256, NumberFromBig } from "utils/helpers"
import IUniswapV2Pair from "@uniswap/v2-periphery/build/IUniswapV2Pair.json"
import useGnosisTransaction from "hooks/useGnosisTransaction"

const PoolInfo = ({ spender, pair, info, signer, hasAllowance, setHasAllowance, safeAddress }) => {
  const { gnosisTransaction } = useGnosisTransaction(safeAddress)
  const token0 = info?.transactionInfo?.[0].token
  const token1 = info?.transactionInfo?.[1].token
  const prettyPercentage = decimal => (decimal * 100 < 0.01 ? "< .01%" : `${(decimal * 100).toFixed(2)}%`)
  const prettyMinted = amount => parseFloat(amount)?.toFixed(3)
  const prettyTotal = amount => Math.round(amount).toLocaleString("en-US")
  const prettyPairName = info?.transactionInfo
    ?.reduce((acc, cv) => {
      return acc + cv.token.symbol + "/"
    }, "")
    .slice(0, -1)

  /*
   * Approve Tokens:
   *
   * Send a gnosis transaction to allow the spender (uniswapV2Router02)
   * to spend the token being approved on behalf of the owner (bbyDao)
   *
   * */
  const handleApproveToken = async (tokenContracts, index) => {
    try {
      const contracts = await tokenContracts
      const contract = await contracts.contracts[index]
      gnosisTransaction(
        {
          abi: minimalABI,
          instance: contract,
          fn: "approve(address,uint256)",
          args: {
            spender,
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
   * Approve Pair:
   *
   * Send a gnosis transaction to allow the spender (uniswapV2Router02)
   * to spend the UNIV-V2 LP token being approved on behalf of the owner (bbyDao)
   *
   * */

  const handleApprovePair = async pairContract => {
    try {
      const pair = await pairContract
      const contract = await pair.contract
      gnosisTransaction(
        {
          abi: IUniswapV2Pair["abi"],
          instance: contract,
          args: {
            spender,
            value: BigNumber.from(max256),
          },
          fn: "approve(address,uint256)",
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
   * Check whether the spender (uniswapV2Router02) is allowed to
   * spend (TransferFrom) the UNI-V2 LP Token on behalf of the owner (bbyDao).
   *
   * */

  const pairContract = React.useMemo(async () => {
    try {
      let contract, pairAllowanceAmount
      if (!!signer && !!pair) {
        contract = new ethers.Contract(pair?.address, IUniswapV2Pair["abi"], signer)
        const allowance = await contract.allowance(safeAddress, spender)
        pairAllowanceAmount = await NumberFromBig(allowance._hex, pair.decimals)
      }

      return {
        contract,
        allowedToSpend: { pair: pairAllowanceAmount > 0 },
      }
    } catch (err) {
      console.log("err", err)
    }
  }, [pair])

  /*
   *
   * Allowance Check:
   *
   * Check whether the spender (uniswapV2Router02) is allowed to
   * spend (TransferFrom) the two Tokens that compose the Pair
   * on behalf of the owner (bbyDao).
   *
   * */

  const tokenContracts = React.useMemo(async () => {
    try {
      let token0Contract, token1Contract, token0AllowanceAmount, token1AllowanceAmount

      if (!!signer) {
        if (!!token0) {
          token0Contract = new ethers.Contract(token0?.address, minimalABI, signer)
          const allowance = await token0Contract.allowance(safeAddress, spender)
          token0AllowanceAmount = await NumberFromBig(allowance?._hex, token0.decimals)
        }

        if (!!token1) {
          token1Contract = new ethers.Contract(token1?.address, minimalABI, signer)
          const allowance = await token1Contract.allowance(safeAddress, spender)
          token1AllowanceAmount = await NumberFromBig(allowance?._hex, token1.decimals)
        }
      }

      return {
        contracts: [token0Contract, token1Contract],
        allowedToSpend: { token0: token0AllowanceAmount > 0, token1: token1AllowanceAmount > 0 },
      }
    } catch (err) {
      console.log("err", err)
    }
  }, [token0, token1, signer])

  /*
   *
   * Listen for Allowance:
   *
   * Set a local state hasAllowance that determines
   * whether or not the supply button is disabled.
   *
   * TODO: on receipt of transaction update hasAllowance variable
   *
   * */

  React.useMemo(async () => {
    try {
      const allowed = await tokenContracts
      setHasAllowance({ ...hasAllowance, ...allowed.allowedToSpend })
    } catch (err) {
      console.log("err", err)
    }
  }, [tokenContracts])

  React.useMemo(async () => {
    try {
      const allowed = await pairContract
      setHasAllowance({ ...hasAllowance, ...allowed.allowedToSpend })
    } catch (err) {
      console.log("err", err)
    }
  }, [pairContract])

  const showToken0Approval = React.useMemo(() => {
    if (!hasAllowance || !token0) {
      return false
    }
    return !hasAllowance.token0 && token0
  }, [hasAllowance, token0])

  const showToken1Approval = React.useMemo(() => {
    if (!hasAllowance || !token1) {
      return false
    }
    return !hasAllowance.token1 && token1
  }, [hasAllowance, token1])

  const showPairTokenApproval = React.useMemo(() => {
    if (!hasAllowance || !token0 || !token1 || !pair) {
      return false
    }

    return (
      hasAllowance.token0 === false &&
      !!token0 &&
      hasAllowance.token1 === false &&
      !!token1 &&
      hasAllowance.pair === false &&
      !!pair
    )
  }, [hasAllowance, token0, token1, pair])

  return (
    <>
      {!isEmpty(info) && (
        <div className="flex flex-col items-center px-12">
          <div className="mb-2">
            <a href={info?.uris?.uniswap} target="_blank" className="underline">
              {prettyPairName} Uniswap V2 Pool
            </a>
          </div>
          {!!info.uniswapTokensMinted && (
            <div className="mb-2 flex w-full flex-col items-center rounded-xl bg-[#e4dfe0] p-3 dark:bg-[#1e293b]">
              <div>
                <a href={info?.uris?.uniswap} target="_blank">
                  Pool
                </a>{" "}
                Tokens Received
              </div>
              <div className="font-thin">~ {prettyMinted(info?.uniswapTokensMinted)}</div>
            </div>
          )}
          {!!info?.percentageOfPool && (
            <div className="mb-2 flex w-full flex-col items-center rounded-xl bg-[#e4dfe0] p-3 dark:bg-[#1e293b]">
              <div>
                Share of{" "}
                <a href={info?.uris?.uniswap} target="_blank">
                  {prettyPairName} Pool
                </a>
              </div>
              <div className="font-thin">{prettyPercentage(eToNumber(info?.percentageOfPool))}</div>
            </div>
          )}
          {!!info?.total && (
            <div className="mb-2 flex w-full flex-col items-center rounded-xl bg-[#e4dfe0] p-3 dark:bg-[#1e293b]">
              <div>
                Total Tokens in{" "}
                <a href={info?.uris?.uniswap} target="_blank">
                  {prettyPairName} Pool
                </a>
              </div>
              <div className="font-thin">~ {prettyTotal(info?.total)}</div>
            </div>
          )}
          <div className="my-4 flex w-full justify-center gap-4">
            {showToken0Approval && (
              <div
                className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
                onClick={() => handleApproveToken(tokenContracts, 0)}
              >
                Approve {token0?.symbol}
              </div>
            )}
            {showToken1Approval && (
              <div
                className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
                onClick={() => handleApproveToken(tokenContracts, 1)}
              >
                Approve {token1?.symbol}
              </div>
            )}
            {showPairTokenApproval && (
              <div
                className="flex cursor-pointer items-center justify-center rounded-3xl bg-[#FC8D4D] p-4 font-normal text-white hover:bg-[#d57239]"
                onClick={() => handleApprovePair(pairContract)}
              >
                Approve {prettyPairName} UNI-V2 LP Token
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default PoolInfo

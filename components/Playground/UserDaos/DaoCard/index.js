import React, { useEffect, useMemo } from "react"
import { useDaoStore } from "../../../../stores/useDaoStore"
import UniswapLpModal from "../../../Dao/UniswapLpModal"
import DaoUtilityBar from "./DaoUtilityBar"
import DaoPfpIcon from "./DaoPfpIcon"
import DaoPfp from "./DaoPfp"
import DaoBalance from "./DaoBalance"
import DaoMembers from "./DaoMembers"
import DaoName from "./DaoName"
import DaoFollowers from "./DaoFollowers"
import ExpandDao from "./ExpandDao"
import DaoCardExpanded from "./DaoCardExpanded/index"

import { usePlaygroundStore } from "/stores/usePlaygroundStore"

import * as api from "/query"
import * as gnosisApi from "/query/gnosisQuery"
import { useMutation, useQuery } from "react-query"

const DaoCard = ({ user, safe }) => {
  const uniswapLpModalOpen = useDaoStore(state => state.uniswapLpModalOpen)

  const { mutateAsync: createDao } = useMutation(api.createDao)

  // dao data from our backend
  const { data: daoData, isLoading: daoIsLoading } = useQuery(["dao", safe], () => api.getDao({ address: safe }), {
    staleTime: 180000,
    refetchOnWindowFocus: false,
    // onError:
  })

  // create dao if dao does not exist in our backend
  useEffect(() => {
    if (!daoData) {
      createDao({
        name: safe,
        type: 1,
        address: safe,
        members: daoMembersData,
      })
    }
  }, [daoIsLoading])

  // query for if dao is apart of nursery

  // daoMembers data from gnosisApi
  const {
    data: daoMembersData,
    error: daoMembersErr,
    isLoading: daoMembersLoading,
  } = useQuery(["daoMembers", safe], () => gnosisApi.daoMembers(safe), {
    staleTime: 200000,
    refetchOnWindowFocus: false,
  })

  // daoBalance data from gnosisApi
  const {
    data: daoTokensData,
    error: daoTokensErr,
    isLoading: daoTokensLoading,
  } = useQuery(["daoTokens", safe], () => gnosisApi.daoBalance(safe), {
    staleTime: 200000,
    refetchOnWindowFocus: true,
  })

  const {
    data: daoTokenssData,
    error: daoTokenssErr,
    isLoading: daoTokenssLoading,
  } = useQuery(["daoTokenList", safe], () => gnosisApi.daoNFTs(safe), {
    staleTime: 200000,
    refetchOnWindowFocus: false,
  })

  console.log('da', daoTokenssData)
  console.log('balances', daoTokensData)

  const tokenLogos = useMemo(() => {
    return daoTokensData?.reduce((acc = [], cv) => {
      const uri = cv?.token?.logoUri
      const symbol = cv?.token?.symbol
      const isETH = parseInt(cv?.ethValue) === 1 && cv?.token === null && cv?.tokenAddress === null
      uri && symbol
        ? acc.push({ uri, symbol })
        : isETH
        ? acc.push({ uri: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png", symbol: "ETH" })
        : null
      return acc
    }, [])
  }, [daoTokensData])

  // check if user is in daoMembersData
  const isMember = daoMembersData?.includes(user)

  const daoExpanded = usePlaygroundStore(state => state.daoExpanded)

  const imgUri = React.useMemo(() => {
    return daoData ? daoData.imgUri : null
  }, [daoData])

  const daoId = React.useMemo(() => {
    return daoData ? daoData.id : null
  }, [daoData])

  return (
    <div className="m-3 flex flex-col rounded-xl bg-slate-200 p-3 dark:bg-slate-800">
      <DaoUtilityBar isMember={isMember} />
      {/* Pfp and Members Section */}
      <div className="flex w-full flex-col lg:flex-row">
        <DaoPfpIcon safe={safe} />
        <DaoPfp daoId={daoId} imgUri={imgUri} members={daoMembersData} address={safe} />
        {/* TODO: loading and error states */}
        <DaoMembers owners={daoMembersData} />
      </div>

      {/* Dao Balance + Expand Dao Section */}
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col">
          <DaoName isMember={isMember} safe={safe} daoData={daoData} daoIsLoading={daoIsLoading} />
          <DaoFollowers address={safe} />
          <DaoBalance safe={safe} />
        </div>
        <ExpandDao safe={safe} />
      </div>

      {/* Dao Card Expanded */}
      {daoExpanded ? <DaoCardExpanded isMember={isMember} safe={safe} tokens={daoTokensData} /> : null}
      {uniswapLpModalOpen && <UniswapLpModal safeAddress={safe} tokenLogos={tokenLogos} />}
    </div>
  )
}

export default DaoCard

import React from "react"
import { useDaoStore } from "../../../../stores/useDaoStore"
import UniswapLpModal  from "../../../Dao/Uniswap/AddLiquidity"
import RemoveLiquidity from "../../../Dao/Uniswap/RemoveLiquidity"
import DaoUtilityBar   from "./DaoUtilityBar"
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

const DaoCard = ({ user, safe, address }) => {
  const uniswapLpModalOpen = useDaoStore(state => state.uniswapLpModalOpen)
  const uniswapRemoveLpModalOpen = useDaoStore(state => state.uniswapRemoveLpModalOpen)

  const { mutateAsync: createDao } = useMutation(api.createDao)

  // dao data from our backend
  const { data: daoData, isLoading: daoIsLoading } = useQuery(["dao", safe], () => api.getDao({ address: safe }), {
    staleTime: 180000,
    refetchOnWindowFocus: false,
    // onError:
  })

  // create dao if dao does not exist in our backend
  React.useEffect(() => {
    if (!daoData && !daoIsLoading) {
      createDao({
        name: safe,
        type: 1,
        address: safe,
        members: daoMembersData,
      })
    }
  }, [daoIsLoading])

  // query for if dao is a part of any nurseries

  // daoMembers data from gnosisApi
  const {
    data: daoMembersData,
    error: daoMembersErr,
    isLoading: daoMembersLoading,
  } = useQuery(["daoMembers", safe], () => gnosisApi.daoMembers(safe), {
    staleTime: 200000,
    refetchOnWindowFocus: false,
  })
  // check if user is in daoMembersData
  const isMember = daoMembersData?.includes(user)
  useQuery(['isMember', user], () => isMember)



  // daoBalance data from gnosisApi
  const {
    data: daoTokensData,
    error: daoTokensErr,
    isLoading: daoTokensLoading,
  } = useQuery(["daoTokens", safe], () => gnosisApi.daoBalance(safe), {
    staleTime: 200000,
    refetchOnWindowFocus: false,
  })


  const daoExpanded = usePlaygroundStore(state => state.daoExpanded)

  const imgUri = React.useMemo(() => {
    return daoData ? daoData.imgUri : null
  }, [daoData])

  const daoId = React.useMemo(() => {
    return daoData ? daoData.id : null
  }, [daoData])

  return (
    <div className="m-3 flex flex-col rounded-xl bg-slate-200 p-3 dark:bg-slate-800">
      <DaoUtilityBar user={user} safe={safe} isMember={isMember} />
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
      {/*{uniswapLpModalOpen && <UniswapLpModal safeAddress={safe} tokenLogos={tokenLogos} />}*/}
    </div>
  )
}

export default DaoCard

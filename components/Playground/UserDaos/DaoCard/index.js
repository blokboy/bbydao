import React from "react"
import DaoUtilityBar from "./DaoUtilityBar"
import DaoPfpIcon from "./DaoPfpIcon"
import DaoPfp from "./DaoPfp"
import DaoBalance from "./DaoBalance"
import DaoMembers from "./DaoMembers"
import DaoName from "./DaoName"
import ExpandDao from "./ExpandDao"
import DaoCardExpanded from "./DaoCardExpanded/index"

import { usePlaygroundStore } from "/stores/usePlaygroundStore"

import * as api from "/query"
import * as gnosisApi from "/query/gnosisQuery"
import { useQuery } from "react-query"

const DaoCard = ({ user, safe }) => {
  // dao data from our backend
  const { data, isLoading: daoDataLoading } = useQuery(["dao", safe], () => api.getDao({ address: safe }), {
    staleTime: 180000,
    refetchOnWindowFocus: false,
  })

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

  const daoExpanded = usePlaygroundStore(state => state.daoExpanded)

  return (
    <div className="m-3 flex flex-col rounded-xl bg-slate-200 p-3 dark:bg-slate-800">
      <DaoUtilityBar />
      {/* Pfp and Members Section */}
      <div className="flex w-full flex-col lg:flex-row">
        <DaoPfpIcon isMember={isMember} />
        <DaoPfp address={safe} />
        {/* TODO: loading and error states */}
        <DaoMembers owners={daoMembersData} />
      </div>

      {/* Dao Balance + Expand Dao Section */}
      <div className="flex flex-row items-end justify-between">
        <div className="flex flex-col">
          <DaoName isMember={isMember} safe={safe} loading={daoDataLoading} />
          <DaoBalance safe={safe} />
        </div>
        <ExpandDao safe={safe} />
      </div>

      {/* Dao Card Expanded */}
      {daoExpanded ? <DaoCardExpanded isMember={isMember} safe={safe} /> : null}
    </div>
  )
}

export default DaoCard

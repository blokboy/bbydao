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

import * as api from "/query/gnosisQuery"
import { useQuery } from "react-query"

const DaoCard = ({ user, safe }) => {
  const {
    data: daoMembersData,
    error: daoMembersErr,
    isLoading: daoMembersLoading,
  } = useQuery(["daoMembers", safe], () => api.daoMembers(safe), { staleTime: 200000, refetchOnWindowFocus: false })

  // check if user is in daoMembersData
  const isMember = daoMembersData?.includes(user)

  const daoExpanded = usePlaygroundStore(state => state.daoExpanded)

  return (
    <div className="flex flex-col dark:bg-slate-800 bg-slate-200 rounded-xl p-3 m-3">
      <DaoUtilityBar />
      {/* Pfp and Members Section */}
      <div className="flex w-full flex-col lg:flex-row">
        <DaoPfpIcon isMember={isMember} />
        <DaoPfp />
        {/* TODO: loading and error states */}
        <DaoMembers owners={daoMembersData} />
      </div>

      {/* Dao Balance + Expand Dao Section */}
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col w-">
          <DaoName isMember={isMember} safe={safe} />
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

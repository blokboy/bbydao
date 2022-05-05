import React from "react"
import TokenCard from './TokenCard';
import * as api from "/query/gnosisQuery"
import { useQuery } from "react-query"

const DaoTokens = ({ safe }) => {
  const {
    data: daoTokensData,
    error: daoTokensErr,
    isLoading: daoTokensLoading,
  } = useQuery(["daoTokens", safe], () => api.daoBalance(safe), { staleTime: 200000, refetchOnWindowFocus: false })

  return (
    <div className="flex flex-col">
      <div className="text-xl">tokens</div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 py-2">
        {daoTokensData?.map((token, i) => <TokenCard token={token} i={i} />)}
      </div>
    </div>
  )
}

export default DaoTokens

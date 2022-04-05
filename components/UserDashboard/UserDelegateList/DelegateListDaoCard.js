import React from "react"
import { useQuery, useMutation, isError } from "react-query"
import * as api from "query"
import { GoPrimitiveDot } from "react-icons/go"

const DelegateListDaoCard = ({ safe }) => {
  const {
    data: daoData,
    error,
    isLoading,
  } = useQuery([`${safe}`], () => api.getDao({ address: safe }), {
    staleTime: 180000,
  })

  if (error) {
    console.log("Error while retrieving dao in DelegateListDaoCard", error)
    return (
      <div className="rounded-xl border bg-slate-100 px-2 py-1 text-red-500 dark:bg-slate-800">
        error
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-slate-100 px-2 py-1 dark:bg-slate-800">
        loading...
      </div>
    )
  }

  return (
    <div className="flex justify-between rounded-xl border px-2 py-1 hover:border-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800">
      <div>{!!daoData.name ? daoData.name : null}</div>
      <div className="animate-pulse text-teal-300 motion-reduce:animate-none">
        <GoPrimitiveDot size={22} />
      </div>
    </div>
  )
}

export default DelegateListDaoCard

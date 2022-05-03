import React from "react"
import NoDaos from "./NoDaos"
import DaoCard from "./DaoCard"
import { useRouter } from "next/router"
import { usePlaygroundStore } from "/stores/usePlaygroundStore"
import { BiCopy } from "react-icons/bi"

// this is currently only set up to display expandable dao cards
// TODO: determine all possible views UserDaos state
const UserDaos = ({ user, data }) => {
  const userSafes = data?.safes
  const address = data?.address
  const expandedDao = usePlaygroundStore(state => state.expandedDao)
  const setExpanedDao = usePlaygroundStore(state => state.setExpandedDao)
  const setDaoExpanded = usePlaygroundStore(state => state.setDaoExpanded)

  const router = useRouter()
  const [copyToast, setCopyToast] = React.useState(false)
  
  const reset = React.useCallback(() => {
    if (expandedDao) {
      setDaoExpanded(false)
    }
    setExpanedDao(null)
  }, [expandedDao, setDaoExpanded, setExpanedDao])

  const copyToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(expandedDao)
    if (!copyToast) {
      setCopyToast(true)
    }
    setTimeout(() => setCopyToast(false), 3000)
  }, [expandedDao])

  React.useEffect(() => {
    router.events.on("routeChangeStart", reset)
    return () => router.events.off("routeChangeStart", reset)
  }, [reset, router.events])

  const toast = React.useMemo(() => {
    return copyToast ? (
      <div className="flex rounded-xl border border-green-600 bg-slate-200 p-1.5 text-xs text-green-600 dark:border-green-300 dark:bg-slate-800 dark:text-green-300">
        copied to clipboard!
      </div>
    ) : null
  }, [copyToast])

  if (!userSafes?.length) {
    return <NoDaos />
  }

  // if expandedDao is set, show expanded dao and remove other daos from view
  if (expandedDao) {
    return (
      <div className="flex w-full flex-col lg:w-2/5 space-y-6">
        <div className="flex flex-row space-x-1 h-10 items-center w-full px-2">
          <div className="text-3xl"> {expandedDao?.substring(0, 6) + "..." + expandedDao.substring(expandedDao.length - 4)}</div>
        <button
          className="flex rounded-full border bg-slate-200 p-2 text-xs hover:border-teal-300 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-teal-300 dark:hover:bg-slate-700"
          onClick={copyToClipboard}
        >
          <BiCopy size={16} />
        </button>
        <div className=""> {toast} </div>
        </div>
        <DaoCard user={user} safe={expandedDao} />
      </div>
    )
  }

  // show all user daos unless expandedDao is set or user has no daos
  // might want to paginate this (infinite scroll)
  if (userSafes.length && !expandedDao) {
    return (
      <div className="flex w-full flex-col lg:w-2/5 space-y-6">
        <div className="text-3xl h-10 px-3 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text font-semibold text-transparent">bbyDAOs</div>
        {userSafes.map((safe, index) => (
          <DaoCard key={index} user={user} safe={safe} />
        ))}
      </div>
    )
  }
}

export default UserDaos

import React from "react"
import DaoCard from "./DaoCard"
import { useRouter } from "next/router"
import { usePlaygroundStore } from "/stores/usePlaygroundStore"

// this is currently only set up to display expandable dao cards
// TODO: determine all possible views UserDaos state
const UserDaos = ({ user, data }) => {
  const userSafes = data?.safes
  const expandedDao = usePlaygroundStore(state => state.expandedDao)
  const setExpanedDao = usePlaygroundStore(state => state.setExpandedDao)
  const setDaoExpanded = usePlaygroundStore(state => state.setDaoExpanded)

  const router = useRouter()

  const reset = React.useCallback(() => {
    if (expandedDao) {
      setDaoExpanded(false)
    }
    setExpanedDao(null)
  }, [expandedDao, setDaoExpanded, setExpanedDao])

  React.useEffect(() => {
    router.events.on("routeChangeStart", reset)
    return () => router.events.off("routeChangeStart", reset)
  }, [reset, router.events])

  if (!userSafes?.length) {
    return (
      <div className="flex w-full flex-col lg:w-2/5">
        <div className="text-3xl h-10 px-3">daos</div>
        <div className="text-xl">No daos found</div>
      </div>
    )
  }

  // if expandedDao is set, show expanded dao and remove other daos from view
  if (expandedDao) {
    return (
      <div className="flex w-full flex-col lg:w-2/5 space-y-6">
        <div className="text-3xl h-10 px-3">
          {expandedDao?.substring(0, 6) + "..." + expandedDao.substring(expandedDao.length - 4)}
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
        <div className="text-3xl h-10 px-3">daos</div>
        {userSafes.map((safe, index) => (
          <DaoCard key={index} user={user} safe={safe} />
        ))}
      </div>
    )
  }
}

export default UserDaos

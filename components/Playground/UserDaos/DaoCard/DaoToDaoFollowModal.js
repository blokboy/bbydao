import create from "zustand"
import React from "react"
import * as api from "/query"
import * as gnosisApi from "query/gnosisQuery"
import { useQuery } from "react-query"

const useStore = create(set => ({
  initiators: [],
  addInitiator: initiator =>
    set(state => ({
      initiators: [...state.initiators, initiator],
    })),
  removeInitiator: initiator =>
    set(state => ({
      initiators: state.initiators.filter(i => i !== initiator),
    })),
}))

export const DaoCard = ({ address }) => {
  const { data: daoData, isLoading: daoIsLoading } = useQuery(
    ["dao", address],
    () => api.getDao({ address: address }),
    {
      staleTime: 180000,
      refetchOnWindowFocus: false,
    }
  )

  const initiators = useStore(state => state.initiators)
  const addInitiator = useStore(state => state.addInitiator)
  const removeInitiator = useStore(state => state.removeInitiator)
  const handleSetInitiators = () => {
    if (initiators?.includes(address)) {
      removeInitiator(address)
    } else {
      addInitiator(address)
    }
  }

  return (
    <div
      className={
        "w-full rounded-lg bg-slate-100 p-2 dark:bg-slate-800" + (initiators?.includes(address) ? " text-sky-500" : "")
      }
      onClick={handleSetInitiators}
    >
      {daoData?.name || "yoo"}
    </div>
  )
}

const DaoToDaoFollowModal = ({ user, targetDao }) => {
  const { data: userDaos, isLoading: userDaosLoading } = useQuery(
    ["userDaos", user],
    () => gnosisApi.safesByOwner(user),
    {
      staleTime: 180000,
      refetchOnWindowFocus: false,
    }
  )

  const initiators = useStore(state => state.initiators)
  const handleLog = () => {
    console.log(initiators)
  }

  const DaoCards = React.useMemo(() => {
    if (userDaos?.safes) {
      return userDaos.safes.map(address => {
        return <DaoCard key={address} address={address} />
      })
    }
  }, [userDaos])

  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="flex flex-col space-y-2">{DaoCards}</div>
      <button onClick={handleLog}>log</button>
    </div>
  )
}

export default DaoToDaoFollowModal

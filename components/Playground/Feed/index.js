import React from "react"
import { useRouter } from "next/router"
import TxCard from "./TxCard"
import { usePlaygroundStore } from "/stores/usePlaygroundStore"
import * as api from "/query/gnosisQuery"
import { useQuery } from "react-query"

// this is currently only set up to display a dao's txs when the dao is expanded
// TODO: determine all possible views for feed state
// [] dao cards when browsing hot/following/favorites
// [] detailed view of dao members?
// [] detailed view of nft offers that a dao has made
const Feed = () => {
  // when a dao is expanded, expandedDao is set to the dao's address in the store
  // the api.allDaoTx query listens for that value in enabled:, once it is set, it will fetch the txs for that dao
  // when the expandedDao is reset to null, txs from that query are cleared, clearing the ui
  // router within the useEffect is used to clear that value on route change
  const expandedDao = usePlaygroundStore(state => state.expandedDao)
  const setExpandedDao = usePlaygroundStore(state => state.setExpandedDao)

  const reset = React.useCallback(() => {
    setExpandedDao(null)
  }, [setExpandedDao])
  
  const router = useRouter()
  React.useEffect(() => {
    router.events.on("routeChangeStart", reset)
    return () => router.events.off("routeChangeStart", reset)
  }, [reset, router.events])

  const { data: txs, status } = useQuery(["txs", expandedDao], () => api.allDaoTx(expandedDao), {
    enabled: !!expandedDao,
    staleTime: 200000,
    refetchOnWindowFocus: false,
  })

  const daoTxs = txs?.results?.map((tx, i) => <TxCard tx={tx} key={i} />)

  return (
    <div className="flex w-full flex-col lg:w-2/5 space-y-6">
      <div className="h-10 flex flex-row space-x-2 overflow-x-auto no-scrollbar dark:bg-slate-900 bg-slate-300 px-3">
        <div className="space-x-3 dark:bg-slate-800 bg-slate-100 border border-slate-100 dark:border-slate-800 hover:dark:border-white hover:border-white hover:dark:bg-slate-700 hover:bg-slate-200 rounded-xl p-1 my-1">
          <span>🔥</span>
          <span>hot</span>
        </div>
        <div className="space-x-3 dark:bg-slate-800 bg-slate-100 border border-slate-100 dark:border-slate-800 hover:dark:border-white hover:border-white hover:dark:bg-slate-700 hover:bg-slate-200 rounded-xl p-1 my-1">
          <span>💙</span>
          <span>following</span>
        </div>
        <div className="space-x-3 dark:bg-slate-800 bg-slate-100 border border-slate-100 dark:border-slate-800 hover:dark:border-white hover:border-white hover:dark:bg-slate-700 hover:bg-slate-200 rounded-xl p-1 my-1">
          <span>⭐</span>
          <span>favorites</span>
        </div>
      </div>
      {/* could be daoTxs or feed items  */}
      <div className="flex space-y-3 flex-col px-3">{daoTxs}</div>
    </div>
  )
}

export default Feed

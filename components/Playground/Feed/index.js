import React                  from "react"
import { useRouter }          from "next/router"
import HistoryTxCard          from './HistoryTxCard'
import PendingTxCard          from "./PendingTxCard"
import TxCard                 from "./TxCard"
import { usePlaygroundStore } from "/stores/usePlaygroundStore"
import * as api               from "/query/gnosisQuery"
import { useQuery }           from "react-query"

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

  const daoTxs = React.useMemo(() => {
    const txsToMap = txs && txs?.results ? txs?.results : []

    return txsToMap ? txsToMap.map((tx, i) => <TxCard tx={tx} key={i} />) : null
  }, [txs])



  /*  Pending Transactions */
  const { data: txsQueued } = useQuery(["txsQueued", expandedDao], () => api.daoTxQueued(expandedDao), {
    enabled: !!expandedDao,
    staleTime: 200000,
    refetchOnWindowFocus: false,
  })

  const daoPendingTxs = React.useMemo(() => {
    const txsToMap = txsQueued && txsQueued?.results ? txsQueued?.results?.filter(tx => tx.type === 'TRANSACTION') : []

    return txsToMap ? txsToMap.map((tx, i) => <PendingTxCard tx={tx} key={i} />) : null
  }, [txsQueued])

  /* Executed Transactions  */
  const { data: txHistory } = useQuery(["txHistory", expandedDao], () => api.daoTxHistory(expandedDao), {
    enabled: !!expandedDao,
    staleTime: 200000,
    refetchOnWindowFocus: false,
  })
  const daoTxHistory = React.useMemo(() => {
    let txsToMap = txHistory && txHistory?.results ? txHistory?.results?.filter(tx => tx.type === 'TRANSACTION') : []

    return txsToMap ? txsToMap.map((tx, i) => <HistoryTxCard tx={tx} key={i} />) : null
  }, [txHistory])

  /*  Toggle Current Feed */
  const [currentFeed, setCurrentFeed] = React.useState("pending")
  const [currentQueuePage, setCurrentQueuePage] = React.useState(null)
  const feed = React.useMemo(() => {
    switch (currentFeed) {
      case 'pending':
        return daoPendingTxs
      case 'history':
        return daoTxHistory
      default:
        return daoPendingTxs
    }

  }, [currentFeed, daoPendingTxs, daoTxHistory])

  return (
    <div className="mt-6 flex w-full flex-col space-y-6 md:mt-0 lg:w-2/5">
      <div className="no-scrollbar flex h-10 flex-row space-x-2 overflow-x-auto bg-slate-300 px-3 dark:bg-slate-900">
        <div className="my-1 space-x-3 rounded-xl border border-slate-100 bg-slate-100 p-1 hover:border-white hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 hover:dark:border-white hover:dark:bg-slate-700">
          <span>🔥</span>
          <span>hot</span>
        </div>
        <div className="my-1 space-x-3 rounded-xl border border-slate-100 bg-slate-100 p-1 hover:border-white hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 hover:dark:border-white hover:dark:bg-slate-700">
          <span>💙</span>
          <span>following</span>
        </div>
        <div className="my-1 space-x-3 rounded-xl border border-slate-100 bg-slate-100 p-1 hover:border-white hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 hover:dark:border-white hover:dark:bg-slate-700">
          <span>⭐</span>
          <span>favorites</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 text-sm font-thin">
        <button
          onClick={() => setCurrentFeed("pending")}
          className={`rounded py-2 px-4 bg-slate-200 hover:bg-slate-100 dark:bg-slate-700 hover:dark:bg-slate-600 ${currentFeed === 'pending' ? 'dark:bg-slate-600' : '' }`}
        >
          Pending
        </button>
        <button
          onClick={() => setCurrentFeed("history")}
          className={`rounded py-2 px-4 bg-slate-200 hover:bg-slate-100 dark:bg-slate-700 hover:dark:bg-slate-600 ${currentFeed === 'history' ? 'dark:bg-slate-600' : '' }`}
        >
          History
        </button>
      </div>
      {/* could be daoTxs or feed items  */}

      <div className="mr-2 flex max-h-[80vh] flex-col overflow-y-auto p-3 pt-0">
        <div>Next Page</div>
        {feed}
      </div>
    </div>
  )
}

export default Feed

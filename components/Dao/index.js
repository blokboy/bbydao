import Head              from "next/head"
import React             from "react"
import { useOsStore }    from "stores/useOsStore"
import { useUiStore }    from "stores/useUiStore"
import { walletSnippet } from "utils/helpers"
import Graph             from "./Graph"
import ProposalHistory   from "./ProposalHistory"
import SidePanel         from "./SidePanel"
import FollowModal       from "./SidePanel/FollowModal"
import TokensNfts        from "./TokensNfts"
import SellModal         from "./TokensNfts/SellModal"
import TransactionModal  from "./TransactionModal"
import TxHistory         from "./TxHistory"

const Dao = ({ data }) => {
  const osSellModalOpen = useOsStore(state => state.osSellModalOpen)
  const followDaoModalOpen = useUiStore(state => state.followDaoModalOpen)
  const txModalOpen = useUiStore(state => state.txModalOpen)

  return (
    <>
      <Head>
        <title>{`bbyDAO | ${walletSnippet(data.safeInfo.address)}`}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full flex-col overflow-auto pt-4 md:flex-row">
        <div className="flex-start flex flex-col px-4 md:w-3/12">
          <SidePanel
            nftImage={data?.collectibles[0]?.imageUri}
            safeInfo={data.safeInfo}
          />
        </div>
        <div className="flex-start item m-3 flex flex-col md:m-0 md:mr-1 md:w-full md:flex-row">
          <div className="flex w-full flex-col md:w-1/2">
            <Graph safeAddress={data.safeInfo.address} />
            <TokensNfts tokens={data.usd} collectibles={data.collectibles} />
          </div>
          <div className="flex w-full flex-col md:w-1/2">
            <TxHistory
              allTxs={data.allTxs}
              owners={data.safeInfo.owners}
              threshold={data.safeInfo.threshold}
            />
            <ProposalHistory />
          </div>

          {/* modals  */}
          {osSellModalOpen && (
            <SellModal safeAddress={data?.safeInfo.address} />
          )}
          {followDaoModalOpen && (
            <FollowModal safeAddress={data?.safeInfo.address} />
          )}
          {txModalOpen && (
            <TransactionModal safeAddress={data?.safeInfo.address} />
          )}
        </div>
      </div>
    </>
  )
}

export default Dao

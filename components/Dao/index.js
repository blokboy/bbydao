import React from "react"
import Head from "next/head"
import TransactionForm from "./TransactionForm"
import SidePanel from "./SidePanel"
import Graph from "./Graph"
import TokensNfts from "./TokensNfts"
import TxHistory from "./TxHistory"
import ProposalHistory from "./ProposalHistory"
import SellModal from "./TokensNfts/SellModal"
import { useOsStore } from "stores/useOsStore"

const Dao = ({ data }) => {
  const osSellModalOpen = useOsStore(state => state.osSellModalOpen)

  return (
    <>
      <Head>
        <title>{`babydao | ${data.safeInfo.address.substring(0, 6)}...`}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mt-3 flex w-full flex-col overflow-auto md:flex-row">
        {/* at least one collectible to side panel */}
        {/* */}
        <SidePanel
          nftImage={data?.collectibles[0]?.imageUri}
          safeInfo={data.safeInfo}
        />
        <div className="flex-start item m-3 flex flex-col md:m-0 md:mr-1 md:w-full">
          <Graph safeAddress={data.safeInfo.address} />
          <TokensNfts tokens={data.usd} collectibles={data.collectibles} />
          <TxHistory
            allTxs={data.allTxs}
            owners={data.safeInfo.owners}
            threshold={data.safeInfo.threshold}
          />
          <TransactionForm safeAddress={data?.safeInfo.address} />
          {/* </div>
        <div className="flex-start m-3 flex flex-col md:m-0 md:ml-1 md:w-[40%]"> */}
          <ProposalHistory />

          {/* modals  */}
          {osSellModalOpen ? (
            <SellModal safeAddress={data?.safeInfo.address} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}

export default Dao

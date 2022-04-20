import React, {useMemo} from "react"
import Head             from "next/head"
import TransactionModal from "./TransactionModal"
import SidePanel from "./SidePanel"
import Graph from "./Graph"
import TokensNfts from "./TokensNfts"
import Nurseries from "./Nurseries"
import TxHistory from "./TxHistory"
import ProposalHistory from "./ProposalHistory"
import SellModal from "./TokensNfts/SellModal"
import FollowModal from "./SidePanel/FollowModal"
import EditDaoMemberModal from "./EditDaoMemberModal"
import UniswapLpModal from "./UniswapLpModal"
import UniswapSwapModal from "./UniswapSwapModal"
import { walletSnippet } from "utils/helpers"

// start to move all dao page modal states from other stores into useDaoStore
import { useDaoStore } from "stores/useDaoStore"
import { useOsStore } from "stores/useOsStore"
import { useUiStore } from "stores/useUiStore"

const Dao = ({ data }) => {
  const osSellModalOpen = useOsStore(state => state.osSellModalOpen)
  const followDaoModalOpen = useUiStore(state => state.followDaoModalOpen)
  const txModalOpen = useUiStore(state => state.txModalOpen)
  const editDaoMemberModalOpen = useDaoStore(state => state.editDaoMemberModalOpen)
  const uniswapLpModalOpen = useDaoStore(state => state.uniswapLpModalOpen)
  const uniswapSwapModalOpen = useDaoStore(state => state.uniswapSwapModalOpen)

  const tokenLogos = useMemo(() => {
    return data?.usd?.reduce((acc = [], cv) => {
      const uri = cv?.token?.logoUri
      const symbol = cv?.token?.symbol
      uri && symbol ? acc.push({uri, symbol}) : null
      return acc
    }, [])
  }, [data.usd])

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
            <TokensNfts
              tokens={data.usd}
              collectibles={data.collectibles}
              safeAddress={data.safeInfo.address}
            />
          </div>
          <div className="flex w-full flex-col md:w-1/2">
            <Nurseries nurseries={null} owners={data.safeInfo.owners} />
            <TxHistory
              allTxs={data.allTxs}
              owners={data.safeInfo.owners}
              threshold={data.safeInfo.threshold}
            />
            <ProposalHistory />
          </div>

          {/* dao page modals  */}
          {osSellModalOpen && (
            <SellModal safeAddress={data?.safeInfo.address} />
          )}
          {followDaoModalOpen && (
            <FollowModal safeAddress={data?.safeInfo.address} />
          )}
          {txModalOpen && (
            <TransactionModal safeAddress={data?.safeInfo.address} />
          )}
          {editDaoMemberModalOpen && (
            <EditDaoMemberModal safeAddress={data?.safeInfo.address} />
          )}
          {uniswapLpModalOpen && (
            <UniswapLpModal safeAddress={data?.safeInfo.address} tokenLogos={tokenLogos}  />
          )}
          {uniswapSwapModalOpen && (
            <UniswapSwapModal safeAddress={data?.safeInfo.address} />
          )}
        </div>
      </div>
    </>
  )
}

export default Dao

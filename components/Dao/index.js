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

import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"

const Dao = ({ data }) => {
  const osSellModalOpen = useOsStore(state => state.osSellModalOpen)

  let safeSdk

  /* create Safe object (pass to AllTxs as prop)
  - only create if connected address is an owner ?
  -- will need all of connected users safes in state to check against
  React.useEffect(() => {
    setSafeAddress()
    console.log(safeSdk)
  }, [])
  
  const setSafeAddress = async () => {
    console.log("setSafeAddress run")
    await window.ethereum.enable()
    await window.ethereum.request({ method: "eth_requestAccounts" })
  
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(provider.provider.selectedAddress)
  
    const ethAdapter = new EthersAdapter({ ethers, signer })
    safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: safeAddress,
    })
  }
*/

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
          <TxHistory allTxs={data.allTxs} threshold={data.safeInfo.threshold} />
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

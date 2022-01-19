import React from "react"
import Head from "next/head"
import TransactionForm from "./TransactionForm"
import SidePanel from "./SidePanel"
import Graph from "./Graph"
import TokensNfts from "./TokensNfts"
import TxHistory from "./TxHistory"
import ProposalHistory from "./ProposalHistory"
import OpenSeaSearch from "./OpenSeaSearch"

import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"

const Dao = ({ data }) => {
  // console.log(data.collectibles[0].imageUri)

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

      <div className="flex flex-col md:flex-row w-full mt-3 overflow-auto">
        {/* at least one collectible to side panel */}
        {/* */}
        <SidePanel
          nftImage={data?.collectibles[0]?.imageUri}
          safeInfo={data.safeInfo}
        />
        <div className="flex flex-col flex-start md:w-[40%] m-3 md:m-0 md:mr-1">
          <Graph safeAddress={data.safeInfo.address} />
          <TokensNfts tokens={data.usd} collectibles={data.collectibles} />
          <TransactionForm safeAddress={data?.safeInfo.address} />
        </div>
        <div className="flex flex-col flex-start md:w-[40%] m-3 md:m-0 md:ml-1">
          <TxHistory
            allTxs={data.allTxs}
            incomingTxs={data.incomingTxs}
            pendingTxs={data.pendingTxs}
            threshold={data.safeInfo.threshold}
          />
          <ProposalHistory />

          {/* modals  */}
          <OpenSeaSearch />
        </div>
      </div>
    </>
  )
}

export default Dao

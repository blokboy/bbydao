import React from "react"
import Dao from "components/Dao"
import axios from "axios"
import SafeServiceClient from "@gnosis.pm/safe-service-client"

const DaoPage = ({ data }) => {
  return <Dao data={data} />
}

export default DaoPage

export const getServerSideProps = async ({ query }) => {
  const safeService = new SafeServiceClient(
    "https://safe-transaction.gnosis.io"
  )

  const safeInfo = await safeService.getSafeInfo(query.address)
  const usd = await safeService.getUsdBalances(query.address)

  // SAFE TXs
  // replace with calls to our backend for safe txs
  // POST "/" {safeContract: query.address }
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API}/transaction/safe`,
    {
      safeContract: query.address,
    }
  )
  const allTxs = res.data

  // Returns a list of transactions for a Safe. The list has different structures depending on the transaction type.
  //const allTxs = await safeService.getMultisigTransactions(query.address)
  // Returns the list of multi-signature transactions that are waiting for the confirmation of the Safe owners.
  // const pendingTxs = await safeService.getPendingTransactions(query.address)
  // Returns the history of incoming transactions of a Safe account.
  //const incomingTxs = await safeService.getIncomingTransactions(query.address)

  const collectibles = await safeService.getCollectibles(query.address)

  return {
    props: {
      data: { safeInfo, usd, allTxs, collectibles },
    },
  }
}

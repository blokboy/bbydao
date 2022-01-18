import React from "react"
import Dao from "components/Dao"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { useConnect } from "wagmi"

const DaoPage = ({ data }) => {
  const [{ data: connectData, error, loading }, connect] = useConnect()

  return <Dao data={data} />
}

export default DaoPage

DaoPage.getInitialProps = async ({ query }) => {
  const safeService = new SafeServiceClient(
    "https://safe-transaction.gnosis.io"
  )

  const safeInfo = await safeService.getSafeInfo(query.address)
  const usd = await safeService.getUsdBalances(query.address)

  // SAFE TXs
  // Returns a list of transactions for a Safe. The list has different structures depending on the transaction type.
  const allTxs = await safeService.getMultisigTransactions(query.address)
  // Returns the list of multi-signature transactions that are waiting for the confirmation of the Safe owners.
  const pendingTxs = await safeService.getPendingTransactions(query.address)
  // Returns the history of incoming transactions of a Safe account.
  const incomingTxs = await safeService.getIncomingTransactions(query.address)
  //

  const collectibles = await safeService.getCollectibles(query.address)

  return {
    data: { safeInfo, usd, allTxs, pendingTxs, incomingTxs, collectibles },
  }
}

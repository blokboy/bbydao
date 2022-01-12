import React from "react"
import TransactionForm from "./TransactionForm"

const Dao = ({ data }) => {
  console.log("safeInfo", data.safeInfo)
  // data.safeInfo: {}
  console.log("usd", data.usd)
  // data.usd: [{...},{...}]
  console.log("all txs", data.allTxs)
  // data.allTxs.results: []
  console.log("pending txs", data.pendingTxs)
  // data.pendingTxs.results: []
  console.log("collectibles", data.collectibles)
  // data.collectibles: []
  // data.collectibles[i].imageUri

  return (
    <>
      <h1>safe address</h1>
      <div>{data?.safeInfo.address}</div>
      <div className="flex flex-col"></div>

      {/* make component to represent these (with pics) */}
      <h1>owners</h1>
      {data?.safeInfo.owners.map((owner, index) => (
        <span className="p-3" key={index}>
          {owner}
        </span>
      ))}

      <TransactionForm safeAddress={data?.safeInfo.address} />
    </>
  )
}

export default Dao

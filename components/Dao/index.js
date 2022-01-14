import React from "react"
import AllTxs from "./AllTxs"
import PendingTxs from "./PendingTxs"
import TransactionForm from "./TransactionForm"
import { useBalance } from "wagmi"
import Link from "next/link"

const Dao = ({ data }) => {
  const [{ data: balanceData, error, loading }, getBalance] = useBalance({
    addressOrName: data.safeInfo.address,
  })

  console.log(balanceData)

  console.log("safeInfo", data.safeInfo)
  // data.safeInfo: {}
  console.log("usd", data.usd)
  // data.usd: [{...},{...}]
  console.log("all txs", data.allTxs)
  // data.allTxs.results: []
  console.log("collectibles", data.collectibles)
  // data.collectibles: []
  // data.collectibles[i].imageUri

  return (
    <>
      <h1>safe address</h1>
      <div>
        {data?.safeInfo.address.substring(0, 6) +
          "..." +
          data?.safeInfo.address.substring(
            data?.safeInfo.address.length - 5,
            data?.safeInfo.address.length - 1
          )}
      </div>
      <div className="flex flex-col"></div>

      {/* make component to represent these (with pics) */}
      <h1>owners</h1>
      {data?.safeInfo.owners.map((owner, index) => (
        <Link key={index} href={`/user/${owner}`}>
          <a>
            <span className="p-3">
              {owner.substring(0, 6) +
                "..." +
                owner.substring(owner.length - 5, owner.length - 1)}
            </span>
          </a>
        </Link>
      ))}
      <h1 className="text-green-500">BALANCE: {balanceData?.formatted} ETH</h1>
      <AllTxs allTxs={data.allTxs} />
      <PendingTxs
        pendingTxs={data.pendingTxs}
        threshold={data.safeInfo.threshold}
      />
      <TransactionForm safeAddress={data?.safeInfo.address} />
    </>
  )
}

export default Dao

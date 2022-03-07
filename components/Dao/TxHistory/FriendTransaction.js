import React from "react"
import { ethers } from "ethers"
import Davatar from "@davatar/react"
import ApproveRejectTx from "./ApproveRejectTx"
import ExecuteTx from "./ExecuteTx"
import { useAccount } from "wagmi"

const FriendTransaction = ({ tx, owners, threshold }) => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <div className="w-full">
      <div className="flex flex-col rounded-lg bg-slate-100 p-1 shadow-inner dark:bg-slate-800">
        <div className="flex flex-row items-center justify-between rounded-lg bg-slate-300 p-2 shadow dark:bg-slate-900">
          <div className="flex flex-row">
            <span className="mr-1 flex w-20 flex-row justify-center rounded border border-white bg-slate-100 p-1 text-[12px] dark:bg-slate-800">
              <span className="text-blue-500">FRIEND</span>
            </span>

            {/* render based on type */}
            <span className="p-1 text-[12px] font-semibold">to:</span>
            <span
              className="flex w-20 justify-center cursor-pointer rounded border border-white bg-slate-100 p-1 text-[12px] text-yellow-500 dark:bg-slate-800"
              onClick={() => {
                navigator.clipboard.writeText(tx?.receiver ? tx.receiver : "")
              }}
            >
              {tx?.receiver ? tx.receiver.slice(0, 4).concat("...") : "DAO"}
            </span>
          </div>

          {/* tx confirmations */}
          <div className="flex flex-row">
            <ul className="flex w-14 flex-row justify-end px-1">
              {tx.approvals?.length < owners.length && tx.approvals?.map((conf, index) => (
                <li
                  key={index}
                  className={
                    "rounded-full border border-white bg-slate-200 dark:bg-slate-900" +
                    (index === 0 ? " ml-0" : " -ml-3")
                  }
                >
                  <Davatar
                    size={22}
                    address={conf}
                    generatedAvatarType="blockies"
                  />
                </li>
              ))}
            </ul>

            <span></span>

            {/* tx rejections */}
            <ul className="flex w-14 flex-row px-1">
            {tx.rejections?.length < owners.length && tx.rejections.map((conf, index) => (
                <li
                  key={index}
                  className={
                    "rounded-full border border-white bg-slate-200 dark:bg-slate-900" +
                    (index === 0 ? " ml-0" : " -ml-3")
                  }
                >
                  <Davatar
                    size={22}
                    address={conf}
                    generatedAvatarType="blockies"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex w-28 flex-row justify-end px-1">
            {data &&
            owners?.includes(data?.address) &&
            tx.approvals?.length >= threshold ? (
              <ExecuteTx tx={tx} address={data?.address} />
            ) : data &&
              owners?.includes(data?.address) &&
              (!tx?.approvals?.includes(data?.address) && 
               !tx?.rejections?.includes(data?.address)) ? (
              <ApproveRejectTx tx={tx} address={data?.address} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendTransaction

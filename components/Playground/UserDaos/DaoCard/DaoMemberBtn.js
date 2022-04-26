import React from "react"
import Link from "next/link"
import { useAccount, useEnsLookup } from "wagmi"
import Router from "next/router"

const DaoMemberBtn = ({ member }) => {
  const [{ data, error, loading }] = useAccount()
  // const [{ data: ensData, error: ensError, loading: ensLoading }, lookupAddress] = useEnsLookup({
  //   address: member,
  // })

  return (
    <Link href={`${member}`}>
      <a>
        <div
          className={
            "p-1 m-1 text-xs rounded-full dark:bg-slate-700 bg-slate-100 border dark:hover:bg-slate-600" +
            (data?.address === member
              ? "border-teal-300 dark:border-teal-300 hover:border-purple-300 dark:hover:border-purple-300"
              : Router?.router?.state?.query?.address === member
              ? "border-orange-300 dark:border-orange-300 hover:border-blue-300 dark:hover:border-blue-300"
              : "border-slate-100 dark:border-slate-700 hover:border-white dark:hover:border-white")
          }
        >
          {/* {ensData ? ensData : member.substring(0, 4) + "..." + member.substring(member.length - 4)} */}
          {member.substring(0, 4) + "..." + member.substring(member.length - 4)}
        </div>
      </a>
    </Link>
  )
}

export default DaoMemberBtn

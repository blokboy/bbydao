import React from "react"
import Link from "next/link"
import Davatar from "@davatar/react"
import { useEnsLookup } from "wagmi"

const MemberCard = ({ member }) => {
  const [{ data, error, loading }, lookupAddress] = useEnsLookup({
    address: member,
  })

  return (
    <>
      <Link href={`/user/${member}`}>
        <a className="mb-1 flex transform flex-row items-center justify-between rounded-xl p-1 transition duration-200 ease-in-out hover:-translate-x-0.5 hover:bg-slate-100 hover:shadow dark:hover:bg-slate-800">
          {/* <Davatar size={40} address={member} generatedAvatarType="blockies" /> */}
          <span className="ml-2 w-9/12 py-2 text-sm hover:bg-gradient-to-r hover:from-[#0DB2AC] hover:via-[#FC8D4D] hover:to-[#FABA32] hover:bg-clip-text hover:text-transparent">
            {loading ? (
              <div className="flex w-full animate-pulse space-x-2">
                <div className="h-4 w-8/12 rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32]"></div>
              </div>
            ) : data && !loading ? (
              data
            ) : !data && !loading ? (
              member.substring(0, 6) +
              "..." +
              member.substring(member.length - 5, member.length - 1)
            ) : (
              <div className="flex w-full animate-pulse space-x-2">
                <div className="h-4 w-8/12 rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32]"></div>
              </div>
            )}
          </span>
        </a>
      </Link>
    </>
  )
}

export default MemberCard

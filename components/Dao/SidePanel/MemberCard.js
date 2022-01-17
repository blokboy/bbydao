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
        <a className="flex flex-row items-center mb-1 p-1 transform hover:-translate-x-0.5 transition duration-200 ease-in-out hover:shadow rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 justify-between">
          <Davatar
            size={40}
            address={member}
            generatedAvatarType="blockies" // optional, 'jazzicon' or 'blockies'
          />
          <span className="text-sm ml-2 py-2 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#0DB2AC] hover:via-[#FC8D4D] hover:to-[#FABA32] w-9/12">
            {loading ? (
              <div className="flex space-x-2 animate-pulse w-full">
                <div className="w-8/12 h-4 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] rounded-full"></div>
              </div>
            ) : data && !loading ? (
              data
            ) : !data && !loading ? (
              member.substring(0, 6) +
              "..." +
              member.substring(member.length - 5, member.length - 1)
            ) : (
              <div className="flex space-x-2 animate-pulse w-full">
                <div className="w-8/12 h-4 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] rounded-full"></div>
              </div>
            )}
          </span>
        </a>
      </Link>
    </>
  )
}

export default MemberCard

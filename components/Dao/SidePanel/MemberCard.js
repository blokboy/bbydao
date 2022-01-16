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
        <a className="flex flex-row items-center mb-1 p-1 transform hover:-translate-x-0.5 hover:-traslate-y-0.5 transition duration-500 ease-in-out hover:shadow rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:z-50">
          <Davatar
            size={35}
            address={member}
            generatedAvatarType="blockies" // optional, 'jazzicon' or 'blockies'
          />
          <span className="text-sm p-3 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#0DB2AC] hover:via-[#FC8D4D] hover:to-[#FABA32]">
            {data
              ? data
              : member.substring(0, 6) +
                "..." +
                member.substring(member.length - 5, member.length - 1)}
          </span>
        </a>
      </Link>
    </>
  )
}

export default MemberCard

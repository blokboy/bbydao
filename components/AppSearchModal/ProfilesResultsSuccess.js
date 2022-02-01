import React from "react"
import Link from "next/link"
import Davatar from "@davatar/react"

const ProfilesResultsSuccess = ({ hits, closeModal }) => {
  return (
    <div className="py-2">
      <span className="px-2 font-semibold">Users:</span>
      <div className="grid max-h-96 grid-cols-2 gap-4 overflow-auto px-2 pt-2">
        {hits.map((hit, index) => (
          <Link key={index} href={`/user/${encodeURIComponent(hit.address)}`}>
            <a onClick={closeModal}>
              <div className="flex h-16 flex-row rounded bg-slate-300 shadow dark:bg-slate-800">
                <div className="m-1 flex w-auto items-center p-0.5">
                  <Davatar
                    size={50}
                    address={hit.address}
                    generatedAvatarType="blockies"
                  />
                </div>
                <div className="ml-3 flex h-full w-full flex-row items-center">
                  <span className="mr-3 text-lg font-semibold">
                    @
                    {hit.ens
                      ? hit.ens
                      : `${hit.address.substring(0, 12) + "..."}`}
                  </span>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProfilesResultsSuccess

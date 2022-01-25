import React from "react"
import { HiBadgeCheck } from "react-icons/hi"

const OsResultsSuccess = ({ hits }) => {
  return (
    <div className="grid max-h-96 grid-cols-2 gap-4 overflow-auto py-4 px-2">
      {hits.map((hit, index) => (
        <div
          key={index}
          className="flex h-16 flex-row rounded bg-slate-300 shadow dark:bg-slate-800"
        >
          <img className="m-1 rounded-full" src={hit.imgUri} alt={hit.name} />
          <div className="ml-3 flex h-full w-full flex-row items-center">
            <span className="mr-3 text-lg font-semibold">{hit.name}</span>
            {hit.safelist_request_status === "verified" ? (
              <HiBadgeCheck className="text-blue-400" />
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OsResultsSuccess

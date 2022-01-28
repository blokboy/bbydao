import React from "react"
import Link from "next/link"
import { HiBadgeCheck } from "react-icons/hi"

const CollectionsResultsSuccess = ({ hits, closeModal }) => {
  return (
    <div className="py-2">
      <span className="px-2 font-semibold">Collections:</span>
      <div className="grid max-h-96 grid-cols-2 gap-4 overflow-auto px-2 pt-2">
        {hits.map((hit, index) => (
          <Link
            key={index}
            href={`/opensea/${encodeURIComponent(
              hit.slug
            )}/${encodeURIComponent(hit.address)}`}
          >
            <a onClick={closeModal}>
              <div className="flex h-16 flex-row rounded bg-slate-300 shadow dark:bg-slate-800">
                <img
                  className="m-1 h-14 w-14 rounded-full object-none"
                  src={hit.imgUri}
                  alt={hit.name}
                />
                <div className="ml-3 flex h-full w-full flex-row items-center">
                  <span className="mr-3 text-lg font-semibold">{hit.name}</span>
                  {hit.safelist_request_status === "verified" ? (
                    <HiBadgeCheck className="text-blue-400" />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CollectionsResultsSuccess

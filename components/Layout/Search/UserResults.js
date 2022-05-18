import React from "react"
import Link from "next/link"
import { useLayoutStore } from "/stores/useLayoutStore"

const UserResults = ({ hits }) => {
  const setSearchOpen = useLayoutStore(state => state.setSearchOpen)

  const reset = React.useCallback(() => {
    setSearchOpen(false)
  }, [setSearchOpen])

  return (
    <div className="py-2 w-full">
      <span className="px-2 font-semibold">Users:</span>
      <div className="grid grid-cols-1 gap-4 px-2 pt-2 md:grid-cols-2">
        {hits.map((hit, index) => (
          <Link key={index} href={`/playground/${encodeURIComponent(hit.address)}`}>
            <a onClick={reset}>
              <div className="flex h-16 w-full flex-row rounded bg-slate-300 shadow dark:bg-slate-800 items-center justify-center space-x-2">
                  <div className="rounded-full h-10 w-10 border border-white"></div>
                <div className="flex h-full w-10/12 flex-row items-center">
                  <span className="overflow-hidden truncate text-lg font-semibold">
                    @{hit.ens ? hit.ens : `${hit.address.substring(0, 12) + "..."}`}
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

export default UserResults

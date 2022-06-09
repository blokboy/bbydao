import React from "react"
import Link from "next/link"
import { useLayoutStore } from "/stores/useLayoutStore"

const CollectionResults = ({ zoraResults }) => {
  const setSearchOpen = useLayoutStore(state => state.setSearchOpen)

  const reset = React.useCallback(() => {
    setSearchOpen(false)
  }, [setSearchOpen])

  return (
    <div className="w-full py-2">
      <span className="px-2 font-semibold">Collections:</span>
      <div className="grid grid-cols-1 gap-4 px-2 pt-2 md:grid-cols-2">
        {zoraResults.map((collection, index) => (
          // <Link key={index} href={`/playground/${encodeURIComponent(collection.address)}`}>
          // <a onClick={reset}>
          <div className="flex h-16 w-full flex-row items-center justify-center space-x-2 rounded bg-slate-300 shadow dark:bg-slate-800">
            <div className="h-10 w-10 rounded-full border border-white"></div>
            <div className="flex h-full w-10/12 flex-row items-center">
              <span className="overflow-hidden truncate text-lg font-semibold">{collection.name}</span>
            </div>
          </div>
          // </a>
          // </Link>
        ))}
      </div>
    </div>
  )
}

export default CollectionResults

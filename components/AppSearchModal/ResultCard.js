import React from "react"
import { useMutation } from "react-query"
import * as api from "query"
import Link from "next/link"
import { useEnsLookup, useAccount, useConnect } from "wagmi"

const ResultCard = ({ address }) => {
  const { status, mutateAsync } = useMutation(api.reqRelationship)

  const [{ data, error, loading }, disconnect] = useAccount()
  const [
    { data: ensData, error: ensError, loading: ensLoading },
    lookupAddress,
  ] = useEnsLookup({
    address: address,
  })

  const handleRequest = () => {
    if (!address || !data) return
    const req = {
      initiator: data.address,
      target: address,
      status: 3,
    }

    mutateAsync(req)
  }

  return (
    <div className="mb-3 flex w-full flex-row justify-between rounded-lg bg-slate-50 py-2 px-1 dark:bg-slate-800">
      <Link href={`/user/${address}`}>
        <a>
          <span>
            @{ensData ? ensData : `${address.substring(0, 12) + "..."}`}
          </span>
        </a>
      </Link>

      {data ? (
        <button
          className="mr-4 rounded-lg border p-1 text-xs"
          onClick={handleRequest}
        >
          request
        </button>
      ) : status === "loading" ? (
        <span className="mr-4 rounded-lg border p-1 text-xs">loading</span>
      ) : status === "success" ? (
        <span className="mr-4 rounded-lg border border-green-400 p-1 text-xs text-green-400">
          requested
        </span>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ResultCard

import React from "react"
import { useAccountStore } from "stores/useAccountStore"
import { useMutation } from "react-query"
import * as api from "query"
import Link from "next/link"
import { useEnsLookup } from "wagmi"

const ResultCard = ({ address, targetId }) => {
  const { id: initiatorId } = useAccountStore.getState().userData
  const { status, mutateAsync } = useMutation(api.reqRelationship)

  const [{ data, error, loading }, lookupAddress] = useEnsLookup({
    address: address,
  })

  const handleRequest = () => {
    if (!id) return
    const req = {
      initiatorId: initiatorId,
      targetId: targetId,
      status: 3,
    }

    mutateAsync(req)
  }

  return (
    <div className="mb-3 flex w-full flex-row justify-between rounded-lg bg-slate-50 py-2 px-1 dark:bg-slate-800">
      <Link href={`/user/${address}`}>
        <a>
          <span>@{data ? data : `@${address.substring(0, 12) + "..."}`}</span>
        </a>
      </Link>
      {status === "loading" ? (
        <span className="mr-4 rounded-lg border p-1 text-xs">loading</span>
      ) : status === "success" ? (
        <span className="mr-4 rounded-lg border border-green-400 p-1 text-xs text-green-400">
          requested
        </span>
      ) : (
        <button
          className="mr-4 rounded-lg border p-1 text-xs"
          onClick={handleRequest}
        >
          request
        </button>
      )}
    </div>
  )
}

export default ResultCard

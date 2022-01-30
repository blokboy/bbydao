import React from "react"
import Link from "next/link"
import { useUiStore } from "stores/useUiStore"
import { useMutation } from "react-query"
import * as api from "../../query"
import { useAccount, useConnect } from "wagmi"

const UserDetails = ({ address, ens }) => {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data, error, loading }, disconnect] = useAccount()

  const setConnectModalOpen = useUiStore(state => state.setConnectModalOpen)

  const { status, mutateAsync } = useMutation(api.reqRelationship)

  const handleRequest = () => {
    const req = {
      initiator: data.address,
      target: address,
      status: 3,
    }

    mutateAsync(req)
  }

  return (
    <div className="mt-4 flex flex-col items-center text-center md:items-start md:text-left">
      {ens ? (
        <span className="h-10 w-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-3xl text-transparent">
          @{ens}
        </span>
      ) : (
        <span className="h-10 w-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-3xl text-transparent">
          @{`${address.substring(0, 6) + "..."}`}
        </span>
      )}

      {data?.address === address ? (
        <></>
      ) : status === "success" ? (
        // style and persist through validating relationship status
        <span className="my-4 w-max rounded-full bg-slate-200 px-4 py-2 shadow hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-700">
          success
        </span>
      ) : connectData?.connected ? (
        <button
          className="my-4 w-max rounded-full bg-slate-200 px-4 py-2 shadow hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-700"
          onClick={handleRequest}
        >
          request
        </button>
      ) : (
        <button
          className="my-4 flex w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
          onClick={setConnectModalOpen}
        >
          <span className="block rounded-full bg-slate-200 px-6 py-1.5 font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
            connect to...
          </span>
        </button>
      )}
    </div>
  )
}

export default UserDetails

import React from "react"
import Link from "next/link"
import { useUiStore } from "stores/useUiStore"
import { useMutation } from "react-query"
import * as api from "../../query"
import { useEnsLookup, useAccount, useConnect } from "wagmi"
import ConnectButton from "components/Layout/Nav/ConnectButton"

const UserDetails = ({ id, address }) => {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data, error, loading }, disconnect] = useAccount()
  const [
    { data: ensData, error: ensError, loading: ensLoading },
    lookupAddress,
  ] = useEnsLookup({
    address: address,
  })

  const setConnectModalOpen = useUiStore(state => state.setConnectModalOpen)

  const { status, mutateAsync } = useMutation(api.reqRelationship)

  const handleRequest = () => {
    const req = {
      // initiatorId: accountData.address,
      // targetId: address
      status: 3,
    }

    mutateAsync(req)
  }

  return (
    <div className="mt-4 flex flex-col items-center text-center md:items-start md:text-left">
      {ensLoading && !ensData ? (
        <div className="flex w-full animate-pulse place-content-center space-x-2 md:place-content-start">
          <div className="h-10 w-3/12 rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] md:w-8/12"></div>
        </div>
      ) : ensData && !ensLoading ? (
        <span className="h-10 w-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-3xl text-transparent">
          @{ensData}
        </span>
      ) : !ensData && !loading ? (
        <span className="h-10 w-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text text-3xl text-transparent">
          @{`${address.substring(0, 6) + "..."}`}
        </span>
      ) : (
        <div className="flex w-full animate-pulse place-content-center space-x-2 md:place-content-start">
          <div className="h-10 w-3/12 rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] md:w-8/12"></div>
        </div>
      )}

      {data?.address === address ? (
        <Link href={"/user/settings"} passHref>
          <button className="my-4 w-max rounded-full bg-slate-200 px-4 py-2 shadow hover:bg-white dark:bg-slate-900 dark:hover:bg-slate-700">
            <a>edit profile</a>
          </button>
        </Link>
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

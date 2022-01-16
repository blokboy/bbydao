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
    <div className="flex flex-col mt-4 items-center text-center md:text-left md:items-start">
      {ensLoading && !ensData ? (
        <div className="flex space-x-2 animate-pulse w-full place-content-center md:place-content-start">
          <div className="w-3/12 md:w-8/12 h-10 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] rounded-full"></div>
        </div>
      ) : ensData && !ensLoading ? (
        <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] w-full h-10">
          @{ensData}
        </span>
      ) : !ensData && !loading ? (
        <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] w-full h-10">
          @{`${address.substring(0, 6) + "..."}`}
        </span>
      ) : (
        <div className="flex space-x-2 animate-pulse w-full place-content-center md:place-content-start">
          <div className="w-3/12 md:w-8/12 h-10 bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] rounded-full"></div>
        </div>
      )}

      {data?.address === address ? (
        <Link href={"/user/settings"} passHref>
          <button className="my-4 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max">
            <a>edit profile</a>
          </button>
        </Link>
      ) : status === "success" ? (
        // style and persist through validating relationship status
        <span className="my-4 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max">
          success
        </span>
      ) : connectData?.connected ? (
        <button
          className="my-4 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max"
          onClick={handleRequest}
        >
          request
        </button>
      ) : (
        <button
          className="flex flex-row my-4 shadow p-0.5 rounded-full bg-gradient-to-r hover:bg-gradient-to-l from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] transform hover:-translate-x-0.5 transition duration-500 ease-in-out hover:bg-white dark:hover:bg-gray-700 w-max"
          onClick={setConnectModalOpen}
        >
          <span className="block px-6 py-1.5 font-bold text-[#FC8D4D] hover:text-white bg-gray-200 dark:bg-gray-900 rounded-full hover:bg-opacity-50 dark:hover:bg-opacity-75">
            connect to...
          </span>
        </button>
      )}
    </div>
  )
}

export default UserDetails

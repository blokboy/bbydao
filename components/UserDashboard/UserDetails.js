import React from "react"
import Link from "next/link"
import { useAccountStore } from "../../stores/useAccountStore"
import { useMutation } from "react-query"
import * as api from "../../query"
import { useEnsLookup } from "wagmi"

const UserDetails = ({ id, address }) => {
  const userData = useAccountStore(state => state.userData)
  const { status, mutateAsync } = useMutation(api.reqRelationship)

  const [{ data, error, loading }, lookupAddress] = useEnsLookup({
    address: address,
  })

  const handleRequest = () => {
    const req = {
      initiatorId: userData.id,
      targetId: id,
      status: 3,
    }

    mutateAsync(req)
  }

  return (
    <div className="flex flex-col mt-4 items-center md:items-start">
      {address ? (
        <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32]">
          @{data || `${address.substring(0, 6) + "..."}` || "address"}
        </span>
      ) : (
        <></>
      )}

      {userData?.address === address ? (
        <Link href={"/user/settings"} passHref>
          <button className="mt-4 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max">
            <a>edit profile</a>
          </button>
        </Link>
      ) : status === "success" ? (
        // style and persist through validating relationship status
        <span className="mt-4 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max">
          success
        </span>
      ) : (
        <button
          className="mt-4 rounded-full shadow bg-gray-200 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-700 px-4 py-2 w-max"
          onClick={handleRequest}
        >
          request
        </button>
      )}
    </div>
  )
}

export default UserDetails

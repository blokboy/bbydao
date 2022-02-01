import React from "react"
import DaoDetail from "./DaoDetail"
import { useAccount } from "wagmi"

const UserDaos = ({ safes, address }) => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <div className="mt-10 flex flex-col md:mt-0">
      <h1 className="mb-4 pl-10 text-xl font-bold underline">
        {data?.address === address ? "my daos" : "user daos"}
      </h1>
      <div className="mx-4 grid grid-cols-2 justify-items-center gap-12 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {safes ? (
          safes?.map((safe, index) => <DaoDetail key={index} safe={safe} />)
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default UserDaos

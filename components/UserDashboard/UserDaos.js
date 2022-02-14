import React from "react"
import DaoDetail from "./DaoDetail"
import { useAccount } from "wagmi"

const UserDaos = ({ safes, address }) => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold underline">
        {data?.address === address ? "my daos" : "user daos"}
      </h1>
      <div className="grid grid-cols-2 justify-items-center gap-3 py-3">
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

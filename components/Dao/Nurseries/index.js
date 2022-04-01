import React from "react"
import NoNurseries from "./NoNurseries"
import CreateNurseryBtn from "./CreateNurseryBtn"
import NurseryList from "./NurseryList"
import { useAccount } from "wagmi"

const Nurseries = ({ nurseries, owners }) => {
  const [{ data, error, loading }, disconnect] = useAccount()

  if (!nurseries && !owners.includes(data?.address)) {
    return <NoNurseries />
  }

  if (!nurseries && owners.includes(data?.address)) {
    return <CreateNurseryBtn />
  }

  return <NurseryList nurseries={nurseries} />
}

export default Nurseries

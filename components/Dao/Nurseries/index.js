import React from "react"
import CreateNurseryBtn from "./CreateNurseryBtn"
import NurseryList from "./NurseryList"

const Nurseries = ({ nurseries }) => {
  if (nurseries) {
    return <CreateNurseryBtn />
  }

  return <NurseryList nurseries={nurseries} />
}

export default Nurseries

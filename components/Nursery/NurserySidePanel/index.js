import React from "react"
import NurseryPfp from "./NurseryPfp"
import NurseryInfo from "./NurseryInfo"
import NurseryStats from "./NurseryStats"

const NurserySidePanel = () => {
  return (
    <div className="flex-start flex h-full flex-col md:flex-col">
      <NurseryPfp />
      <NurseryInfo />
      <NurseryStats />
    </div>
  )
}

export default NurserySidePanel

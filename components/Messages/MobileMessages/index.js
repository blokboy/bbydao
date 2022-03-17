import React from "react"
import MobileInboxNavigation from "./MobileInboxNavigation"
import MobileThreadList from "./MobileThreadList"
import FooterNavigation from "./FooterNavigation"

const MobileMessages = () => {
  return (
    <div className="">
      <MobileInboxNavigation />
      <MobileThreadList />
    </div>
  )
}

export default MobileMessages

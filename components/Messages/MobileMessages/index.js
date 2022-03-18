import React from "react"
import MobileInboxNavigation from "./MobileInboxNavigation"
import MobileThreadList from "./MobileThreadList"
import MobileMessageView from "./MobileMessageView"
import FooterNavigation from "./FooterNavigation"
import { useMessageStore } from "stores/useMessageStore"

const MobileMessages = () => {
  const mobileThreadView = useMessageStore(state => state.mobileThreadView)
  // const setMobileThreadView = useMessageStore(state => state.setMobileThreadView)
  return (
    <div>
      {mobileThreadView ? (
        <>
          <MobileInboxNavigation />
          <MobileThreadList />
        </>
      ) : (
        <MobileMessageView />
      )}
    </div>
  )
}

export default MobileMessages

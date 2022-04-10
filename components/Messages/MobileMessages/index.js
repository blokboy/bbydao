import React from "react"
import MobileInboxNavigation from "./MobileInboxNavigation"
import ThreadList from "../ThreadList"
import MobileMessageView from "./MobileMessageView"
import { useMessageStore } from "stores/useMessageStore"

const MobileMessages = () => {
  const mobileThreadView = useMessageStore(state => state.mobileThreadView)
  // const setMobileThreadView = useMessageStore(state => state.setMobileThreadView)
  return (
    <>
      {mobileThreadView ? (
        <>
          <MobileInboxNavigation />
          <ThreadList />
        </>
      ) : (
        <MobileMessageView />
      )}
    </>
  )
}

export default MobileMessages

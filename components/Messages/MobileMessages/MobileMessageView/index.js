import React from "react"
import { useMessageStore } from "stores/useMessageStore"
import MessageContent from "components/Messages/MessageView/MessageContent"
import MessageForm from "components/Messages/MessageView/MessageForm"
import { HiArrowCircleLeft } from "react-icons/hi"

const MobileMessageView = () => {
  const mobileThreadView = useMessageStore(state => state.mobileThreadView)
  const setMobileThreadView = useMessageStore(
    state => state.setMobileThreadView
  )

  return (
    <div>
      <div className="grid w-full grid-cols-3 items-center justify-center p-3">
        <button className="flex items-center" onClick={setMobileThreadView}>
          <HiArrowCircleLeft size={28} />
        </button>
        <div className="col-span-2" />
        <div className="col-span-3" />
      </div>
      <MessageContent />
      {/* <MessageForm /> */}
    </div>
  )
}

export default MobileMessageView

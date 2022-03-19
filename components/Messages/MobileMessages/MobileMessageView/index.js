import React from "react"
import { useMessageStore } from "stores/useMessageStore"
import MobileMessageContent from "./MobileMessageContent"
import MobileMessageInput from "./MobileMessageInput"
import { HiArrowCircleLeft } from "react-icons/hi"

const MobileMessageView = () => {
  const mobileThreadView = useMessageStore(state => state.mobileThreadView)
  const setMobileThreadView = useMessageStore(
    state => state.setMobileThreadView
  )

  return (
    <div>
      <div className="sticky top-0 grid w-full grid-cols-3 items-center justify-center p-3 dark:bg-slate-900">
        <button className="flex items-center" onClick={setMobileThreadView}>
          <HiArrowCircleLeft size={28} />
        </button>
        <div className="col-span-2" />
        <div className="col-span-3" />
      </div>
      <MobileMessageContent />
      <MobileMessageInput />
    </div>
  )
}

export default MobileMessageView

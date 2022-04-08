import React from "react"
import DesktopInboxNavigation from "./DesktopInboxNavigation"
import DesktopThreadList from "./DesktopThreadList"
import DesktopMessageView from "./DesktopMessageView"

const DesktopMessages = () => {
  return (
    <div className="h-auto sm:h-screen -mt-16 flex h-screen flex-row pt-16">
      <div className="flex flex-col md:w-1/3">
        <DesktopInboxNavigation />
        <DesktopThreadList />
      </div>
      <div className="flex flex-col p-4 md:w-2/3">
        <DesktopMessageView />
      </div>
    </div>
  )
}

export default DesktopMessages

import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useUiStore } from "stores/useUiStore"
import { FiMail } from "react-icons/fi"
import MessagesDropdown from "./MessagesDropdown"

const MessagesIcon = () => {
  const [messagesOpen, setMessagesOpen] = React.useState(false)
  const messagesCount = useUiStore(state => state.messagesCount)
  const setMessagesCount = useUiStore(state => state.setMessagesCount)
  const [count, setCount] = React.useState(19)

  const clickAway = () => {
    if (!messagesOpen) {
      return
    }
    setMessagesOpen(false)
  }

  // Link to /messages instead of dropdown

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <div className="hidden md:flex flex-row items-center justify-center mr-3">
        <button
          className="flex rounded-full border border-slate-400 shadow bg-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-700 p-1 h-10 w-10 justify-center items-center text-slate-800 dark:text-white"
          onClick={() => setMessagesOpen(!messagesOpen)}
        >
          <FiMail />
        </button>
        {count > 0 ? (
          <span
            className={
              "absolute -mt-8 -mr-8 bg-red-500 text-white text-xs rounded-full py-1" +
              (count > 10 ? " px-1" : " px-2")
            }
          >
            {count}
          </span>
        ) : (
          <></>
        )}

        {/* && messagesCount */}
        <MessagesDropdown messagesOpen={messagesOpen} />
      </div>
    </ClickAwayListener>
  )
}

export default MessagesIcon

import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useUiStore } from "stores/useUiStore"
import { FiMail } from "react-icons/fi"
import MessagesDropdown from "./MessagesDropdown"

const MessagesIcon = () => {
  const [messagesOpen, setMessagesOpen] = React.useState(false)
  const messagesCount = useUiStore(state => state.messagesCount)
  const setMessagesCount = useUiStore(state => state.setMessagesCount)
  const [count, setCount] = React.useState(count? count : 0)

  const clickAway = () => {
    if (!messagesOpen) {
      return
    }
    setMessagesOpen(false)
  }

  // Link to /messages instead of dropdown

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <div className="mr-3 hidden flex-row items-center justify-center md:flex">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-slate-800 shadow hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700"
          onClick={() => setMessagesOpen(!messagesOpen)}
        >
          <FiMail />
        </button>
        {count > 0 ? (
          <span
            className={
              "absolute -mt-8 -mr-8 rounded-full bg-red-500 py-1 text-xs text-white" +
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

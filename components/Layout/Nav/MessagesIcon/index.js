import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useUiStore } from "stores/useUiStore"
import { FiMail } from "react-icons/fi"

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

  return (
    <ClickAwayListener onClickAway={clickAway}>
      <div className="hidden md:flex flex-row items-center justify-center mr-3">
        <button
          className="flex rounded-full border border-gray-400 shadow bg-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700 p-1 h-10 w-10 justify-center items-center text-gray-800 dark:text-white"
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
        <div
          className={
            (messagesOpen ? "absolute " : "hidden ") +
            "z-50 rounded border shadow -ml-96 mt-32 px-4 py-2 text-gray-800 bg-gray-200 dark:text-white dark:bg-gray-900 w-4/12"
          }
        >
          <ul className="py-1" onClick={clickAway}>
            <li>test</li>
          </ul>
        </div>
      </div>
    </ClickAwayListener>
  )
}

export default MessagesIcon

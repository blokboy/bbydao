import React from "react"
import ClickAwayListener from "react-click-away-listener"
import { useUiStore } from "stores/useUiStore"
import { FiMail } from "react-icons/fi"
import MessagesDropdown from "./MessagesDropdown"
import { useQuery } from "react-query"
import * as api from "query"

const MessagesIcon = ({ address }) => {
  const [messagesOpen, setMessagesOpen] = React.useState(false)
  const messagesCount = useUiStore(state => state.messagesCount)
  const setMessagesCount = useUiStore(state => state.setMessagesCount)
  const [count, setCount] = React.useState(count ? count : 0)

  const { data } = useQuery(
    ["threads"],
    () => api.getUserThreads({ address }),
    { staleTime: 180000 }
  )

  const threads = []
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      threads.push([key, value])
    }
  }

  React.useEffect(() => {
    if (!data) return
    setMessagesCount(data?.length || 1)
  }, [data]) /* eslint-disable-line react-hooks/exhaustive-deps */

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
          className="nav-btn"
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
        <MessagesDropdown
          messagesOpen={messagesOpen}
          threads={threads}
          clickAway={clickAway}
        />
      </div>
    </ClickAwayListener>
  )
}

export default MessagesIcon

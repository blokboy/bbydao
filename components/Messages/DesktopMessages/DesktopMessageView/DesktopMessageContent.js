import React from "react"
import MessageCard from "../../MessageUi/MessageCard"
import { useMessageStore } from "stores/useMessageStore"
import * as api from "query"
import { useQuery } from "react-query"

const DesktopMessageContent = () => {
  const { threadChannel } = useMessageStore()
  const { data: messages } = useQuery(
    ["thread messages", threadChannel],
    () => api.getThreadMessages({ channel: threadChannel }),
    {
      enabled: !!threadChannel,
      // retry: false,
      // retryOnMount: false,
      // refetchOnWindowFocus: false,
      // staleTime: Infinity,
    }
  )

  const messagesEndRef = React.useRef(null)
  const scrollToBottom = () => {
    if (!messagesEndRef.current) return
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
  React.useEffect(scrollToBottom, [messages])

  if (!messages?.length) {
    return (
      <div className="flex-1 bg-slate-50 px-3 pb-44 dark:bg-slate-800">
        No Messages
      </div>
    )
  }

  return (
    <div className="mb-3 flex-1 overflow-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
      {messages?.map(message => (
        <MessageCard key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default DesktopMessageContent

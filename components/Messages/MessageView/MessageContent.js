import React from "react"
import MessageViewCard from "./MessageViewCard"
import { useMessageStore } from "stores/useMessageStore"
import * as api from "query"
import { useQuery } from "react-query"

const MessageContent = () => {
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
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
  React.useEffect(scrollToBottom, [threadChannel])

  return (
    <div className="h-[85%] md:p-3">
      <div className="h-full overflow-scroll rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
        {messages?.map(message => (
          <MessageViewCard key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageContent

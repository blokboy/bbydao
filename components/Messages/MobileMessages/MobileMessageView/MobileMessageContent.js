import React               from "react"
import MessageCard         from "../../MessageUi/Card"
import { useMessageStore } from "stores/useMessageStore"
import * as api from "query"
import { useQuery } from "react-query"

const MobileMessageContent = () => {
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
      <div className="bg-slate-50 px-3 pb-44 dark:bg-slate-800">
        No Messages
      </div>
    )
  }

  return (
    <div className="bg-slate-50 px-3 pb-20 sm:pb-2 pt-4 dark:bg-slate-800">
      {messages?.map(message => (
        <MessageCard key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MobileMessageContent

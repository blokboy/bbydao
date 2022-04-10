import React from "react"
import MessageCard from "../../MessageUi/Card"
import { useMessageStore } from "stores/useMessageStore"
import * as api from "query"
import { useQuery } from "react-query"

const MobileMessageContent = () => {
  const { threadChannel } = useMessageStore()
  const { data, isFetching, isFetched } = useQuery(
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

  const messages = React.useMemo(() => {
    return data && isFetched ? data : []
  }, [data, isFetched])

  const messagesEndRef = React.useRef(null)
  const scrollToBottom = () => {
    if (!messagesEndRef.current) return
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
  React.useEffect(scrollToBottom, [messages])

  const messagesDisplay = React.useMemo(() => {
    return messages.length ? (
      <div className="bg-slate-50 px-3 pb-20 pt-4 dark:bg-slate-800 sm:pb-2">
        {messages?.map(message => (
          <MessageCard key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    ) : (
      <div className="bg-slate-50 px-3 pb-44 dark:bg-slate-800">
        No Messages
      </div>
    )
  }, [messages])

  return React.useMemo(() => {
    return isFetching ? (
      <div className="w-full p-4 text-center">
        <p className="max-w-xs">Loading messages...</p>
      </div>
    ) : (
      messagesDisplay
    )
  }, [isFetching])
}

export default MobileMessageContent

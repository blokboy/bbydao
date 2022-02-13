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

  return (
    <div className="h-[82%] overflow-auto rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
      {messages?.map(message => (
        <MessageViewCard key={message.id} message={message} />
      ))}
    </div>
  )
}

export default MessageContent

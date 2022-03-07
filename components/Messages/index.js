import React from "react"
import Head from "next/head"
import MessageNav from "./MessageNav"
import MessageView from "./MessageView"
import ListView from "./ListView"

const Messages = () => {
  return (
    <>
      <Head>
        <title>{"bbyDAO | messages"}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-full w-full flex-col pt-4">
        <MessageNav />
        <div className="flex h-full w-full flex-col p-3 md:h-5/6 md:flex-row">
          <ListView />
          <MessageView />
        </div>
      </div>
    </>
  )
}

export default Messages

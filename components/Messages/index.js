import React from "react"
import Head from "next/head"
import MessageView from "./MessageView"
import ListView from "./ListView"

const Messages = ({ data }) => {
  return (
    <>
      <Head>
        <title>{"bbyDAO | messages"}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen w-full justify-center">
        {/* toolbar component that controls the message view and list view */}
        <ListView threads={data} />
        <MessageView />
      </div>
    </>
  )
}

export default Messages

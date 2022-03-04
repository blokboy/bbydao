import React from "react"
import Head from "next/head"
import MessageNav from "./MessageNav"
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

      <div className="flex h-screen w-full flex-col">
        <MessageNav />
        <div className="flex h-full w-full flex-col p-3 md:flex-row">
          {/* <ListView threads={data} /> */}
          <MessageView />
        </div>
      </div>
    </>
  )
}

export default Messages

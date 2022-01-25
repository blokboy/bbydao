import React from "react"
import Head from "next/head"
import MessageView from "./MessageView"
import ListView from "./ListView"

const Messages = () => {
  return (
    <>
      <Head>
        <title>{"babydao | messages"}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen w-full justify-center">
        <ListView />
        <MessageView />
      </div>
    </>
  )
}

export default Messages

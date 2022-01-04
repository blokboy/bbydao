import React from "react"
import Head from "next/head"
import MessageView from "./MessageView"

const Messages = () => {
  return (
    <>
      <Head>
        <title>{"babydao | messages"}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full h-screen flex justify-center">
        <MessageView />
      </div>
    </>
  )
}

export default Messages

import React from "react"
import Head from "next/head"
import MessageView from "./MessageView"
import ListView from "./ListView"

const Messages = ({ data  }) => {
  return (
    <>
      <Head>
        <title>{"babydao | messages"}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen w-full justify-center">
        <ListView threads={ data }/>
        <MessageView />
      </div>
    </>
  )
}

export default Messages

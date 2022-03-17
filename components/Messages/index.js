import React from "react"
import Head from "next/head"
import MessageNav from "./MessageNav"
import MessageView from "./MessageView"
import ListView from "./ListView"
import MobileMessages from "./MobileMessages"
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect"

const Messages = () => {
  if (isMobile) {
    return (
      <>
        <Head>
          <title>{"bbyDAO | messages"}</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MobileMessages />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{"bbyDAO | messages"}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-full w-full flex-col pt-4">
        <MessageNav />
        <div className="flex h-full w-full flex-row p-3 md:h-5/6">
          <ListView />
          <MessageView />
        </div>
      </div>
    </>
  )
}

export default Messages

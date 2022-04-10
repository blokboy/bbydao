import React from "react"
import Head from "next/head"
import MobileMessages from "./MobileMessages"
import DesktopMessages from "./DesktopMessages"
import { isMobile } from "react-device-detect"

const Messages = () => {
  const messagesComponent = React.useMemo(() => {
    return isMobile ? <MobileMessages /> : <DesktopMessages />
  }, [isMobile])

  return (
    <>
      <Head>
        <title>{"bbyDAO | messages"}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {messagesComponent}
    </>
  )
}

export default Messages

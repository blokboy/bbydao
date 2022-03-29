import React from "react"
import Head from "next/head"
import MobileMessages from "./MobileMessages"
import DesktopMessages from "./DesktopMessages"
import { isMobile } from "react-device-detect"

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
      <DesktopMessages />
    </>
  )
}

export default Messages

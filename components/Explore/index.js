import React from "react"
import Head from "next/head"
import Splash from "./Splash"
import ProfilesContainer from "./ProfilesContainer"

const Explore = () => {
  return (
    <>
      <Head>
        <title>babydao</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen w-screen flex-col">
        <Splash />
        <ProfilesContainer />
      </div>
    </>
  )
}

export default Explore

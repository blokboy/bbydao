import React from "react"
import Head from "next/head"
import Splash from "./Splash"
import ProfilesContainer from "./ProfilesContainer"

const Explore = () => {
  return (
    <>
      <Head>
        <title>bbyDAO</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col pt-4">
        <Splash />
        <ProfilesContainer />
      </div>
    </>
  )
}

export default Explore

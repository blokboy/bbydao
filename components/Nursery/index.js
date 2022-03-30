import React from "react"
import Head from "next/head"
import SidePanel from "./SidePanel"

const Nursery = () => {
  return (
    <>
      <Head>
        <title>{`bbyDAO | nursery`}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full flex-col overflow-auto pt-4 md:flex-row">
        <div className="flex-start flex flex-col px-4 md:w-3/12">
          <SidePanel />
        </div>

        <div className="flex-start item m-3 flex flex-col md:m-0 md:mr-1 md:w-full md:flex-row">
          <div className="flex w-full flex-col md:w-1/2">col 1 </div>
          <div className="flex w-full flex-col md:w-1/2">col 2</div>
        </div>
      </div>
    </>
  )
}

export default Nursery

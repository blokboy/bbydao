import React from "react"
import Head from "next/head"
import Explore from "components/Explore"
import { useConnect, useAccount } from "wagmi"

const Home = () => {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  if (accountData) {
    return <Explore accountData={accountData} />
  }

  return (
    <>
      <Head>
        <title>babydao</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w- full min-h-screen">
        <h1 className="text-3xl sm:text-5xl mb-3">Welcome to babydao</h1>
        <p className="mb-3">Get started by connecting your wallet </p>

        <div className="flex flex-col">
          {data.connectors.map(x => (
            <button
              className="border rounded-xl my-2 py-3 px-6"
              disabled={!x.ready}
              key={x.id}
              onClick={() => connect(x)}
            >
              {x.name}
              {!x.ready && " (unsupported)"}
            </button>
          ))}

          {error && <div>{error?.message ?? "Failed to connect"}</div>}
        </div>
      </main>
    </>
  )
}

export default Home

import React from "react"
import Head from "next/head"
import axios from "axios"
import { useAccountStore } from "stores/useAccountStore"

import Explore from "components/Explore"
import { RainbowButton } from "@rainbow-me/rainbow-button"
import { useRainbowButton } from "hooks/useRainbowButton"

import { useConnect, useAccount } from "wagmi"

const Home = () => {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const setUserData = useAccountStore(state => state.setUserData)
  const setRainbowAccount = useAccountStore(state => state.setRainbowAccount)

  React.useEffect(() => {
    if (!accountData) return
    console.log("useEffect ran", accountData)

    // axios POST request to heroku API
    axios
      .post(`${process.env.accounts_api}`, {
        address: accountData.address,
        ens: accountData.ens?.name ? accountData.ens.name : null,
        ensAvatar: accountData.ens?.avatar ? accountData.ens.avatar : null,
      })
      .then(
        response => {
          console.log(response)
          // const { data } = response
          // setUserData(data)
          // setRainbowAccount(data.address)
        },
        error => {
          console.log("Accounts API error:", error)
        }
      )
  }, [accountData]) /* eslint-disable-line react-hooks/exhaustive-deps */

  if (!accountData) {
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

  if (accountData) {
    return (
      <div>
        {/* <img src={accountData.ens?.avatar} alt="ENS Avatar" /> */}
        <div>
          {accountData.ens?.name
            ? `${accountData.ens?.name} (${accountData.address})`
            : accountData.address}
        </div>
        <div>Connected to {accountData.connector.name}</div>
        <button onClick={disconnect}>Disconnect</button>
      </div>

      // <Explore />
    )
  }
}

export default Home

import React from "react"
import Head from "next/head"
import { RainbowButton } from "@rainbow-me/rainbow-button"
// import Dashboard from "../components/Dashboard"

const Home = () => {
  const [connector, setConnector] = React.useState(undefined)
  const [accounts, setAccounts] = React.useState(undefined)

  const onConnectorInitialized = React.useCallback(
    connector => setConnector(connector),
    [] /* eslint-disable-line react-hooks/exhaustive-deps */
  )

  React.useEffect(() => {
    if (!connector) return

    // Capture initial connector state
    setAccounts(connector.accounts)

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error
      }

      // Get provided accounts and chainId
      const { accounts } = payload.params[0]
      setAccounts(accounts)
    })

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0]
      setAccounts(accounts)
      //setChainId(chainId)
    })

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error
      }

      // Delete connector
      // IMPORTANT if users reject the session request you have to
      // create a new session from scratch. `disconnect` will trigger
      // in that case
      setConnector(null)
      setAccounts(null)
      //setChainId(null)
      // setSelectedChain(null)
    })
  }, [connector]) /* eslint-disable-line react-hooks/exhaustive-deps */

  const renderNotConnected = React.useMemo(() => {
    return (
      <>
        <Head>
          <title>babydao</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl sm:text-5xl mb-3">Welcome to babydao</h1>
          <p className="mb-3">Get started by connecting your wallet </p>
          <RainbowButton
            chainId={1}
            connectorOptions={{ bridge: "https://bridge.walletconnect.org" }}
            onConnectorInitialized={onConnectorInitialized}
          />
        </main>
      </>
    )
  }, [onConnectorInitialized])

  //render if connected
  const renderConnected = React.useMemo(() => {
    //return <Dashboard accounts={accounts} />
    return <h1>connected: {accounts}</h1>
  }, [accounts]) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <div>
      {connector?.connected && accounts?.length
        ? renderConnected
        : renderNotConnected}
    </div>
  )
}

export default Home

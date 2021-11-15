import React from "react"

export const useRainbowButton = () => {
  const [connector, setConnector] = React.useState(undefined)
  const [accounts, setAccounts] = React.useState(undefined)

  const onConnectorInitialized = React.useCallback(
    connector => setConnector(connector),
    [] /* eslint-disable-line react-hooks/exhaustive-deps */
  )

  React.useEffect(() => {
    console.log("onConnectorInitialized from hook:", connector)
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

  return [connector, accounts, onConnectorInitialized]
}

import "../styles/globals.css"
import React from "react"
import { Hydrate, QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { ThemeProvider } from "next-themes"
import Layout from "../components/Layout"

import {
  InjectedConnector,
  Provider,
  WalletConnectConnector,
  WalletLinkConnector,
  chain,
  defaultChains,
} from "wagmi"

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
const infuraId = process.env.INFURA_ID

// Chains for connectors to support
const chains = defaultChains

// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find(x => x.id === chainId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: "baby dao",
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ]
}

function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <Provider autoConnect connectors={connectors}>
      <ThemeProvider attribute="class">
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
            <ReactQueryDevtools />
          </Layout>
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp

import "../styles/globals.css"
import "../styles/emoji-mart.css"
import React from "react"
import Router from "next/router"
import { Hydrate, QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { ThemeProvider } from "next-themes"
import Layout from "../components/Layout"
import Loading from "../components/Layout/Loading"

import { Provider, chain, defaultChains, createWagmiClient} from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

function MyApp({ Component, pageProps, ...appProps }) {
  const [queryClient] = React.useState(() => new QueryClient())

  // API key for Ethereum node
  const infuraId = process.env.INFURA_ID

  // Chains for connectors to support
  const chains = defaultChains
  const defaultChain = chain.mainnet

  // Set up connectors
  // const connectors = ({ chainId }) => {
  //   const rpcUrl =
  //     chains.find(x => x.id === chainId)?.rpcUrls?.[0] ??
  //     chain.mainnet.rpcUrls[0]
  //   return [
  //     new InjectedConnector({ chains }),
  //     new WalletConnectConnector({
  //       options: {
  //         infuraId,
  //         qrcode: true,
  //       },
  //     }),
  //     new WalletLinkConnector({
  //       options: {
  //         appName: "baby dao",
  //         jsonRpcUrl: `${rpcUrl}/${infuraId}`,
  //       },
  //     }),
  //   ]
  // }

  const wagmiClient = createWagmiClient({
    autoConnect: true,
    connectors({ chainId }) {
      const chain = chains.find((x) => x.id === chainId) ?? defaultChain
      const rpcUrl = chain.rpcUrls.infura
        ? `${chain.rpcUrls.infura}/${infuraId}`
        : chain.rpcUrls.default
      return [
        new InjectedConnector(),
        new CoinbaseWalletConnector({
          options: {
            appName: 'wagmi',
            chainId: chain.id,
            jsonRpcUrl: rpcUrl,
          },
        }),
        new WalletConnectConnector({
          options: {
            qrcode: true,
            rpc: {
              [chain.id]: rpcUrl,
            },
          },
        }),
      ]
    },
  })

  const [loading, setLoading] = React.useState(false)

  Router.events.on("routeChangeStart", url => {
    setLoading(true)
  })

  Router.events.on("routeChangeComplete", url => {
    setLoading(false)
  })

  return (
    <ThemeProvider attribute="class">
      <Provider autoConnect client={wagmiClient}>
        <QueryClientProvider client={queryClient}>
          <Layout>
            {loading ? (
              <Loading />
            ) : (
              <>
                <Component {...pageProps} />
                <ReactQueryDevtools />
              </>
            )}
          </Layout>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default MyApp

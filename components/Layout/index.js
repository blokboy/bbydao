import React from "react"
import { createClient } from "urql"
import { useSigner } from "wagmi"
import { useDaoStore } from "stores/useDaoStore"
import Nav from "./Nav"
import dynamic from "next/dynamic"
const Search = dynamic(() => import("./Search"))
import { useLayoutStore } from "/stores/useLayoutStore"
import ConnectModal from "./ConnectModal"
import CreateThreadModal from "../Messages/CreateThreadModal"
import OfferModal from "../Collection/OfferModal"
import BuyModal from "../Collection/BuyModal"
import NetworkWarning from "./Nav/NetworkWarning"
import MobileNotificationsModal from "./MobileNotificationsModal"

const Layout = ({ children }) => {
  const UniGraphAPI = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
  const searchOpen = useLayoutStore(state => state.searchOpen)
  const setSigner = useLayoutStore(state => state.setSigner)
  const setETHPriceUSD = useDaoStore(state => state.setETHPriceUSD)
  const setUniswapV2GraphClient = useDaoStore(state => state.setUniswapV2GraphClient)
  const { data, isError, isLoading } = useSigner()

  /* Save Signer Object globally */
  const signer = React.useMemo(() => {
    return data
  }, [isLoading, isError, data])

  React.useEffect(() => {
    if (!!signer) setSigner(signer)
  }, [signer])

  const client = createClient({
    url: UniGraphAPI,
  })

  /*  Get ETH price in USD  */
  React.useMemo(async () => {
    try {
      if (!!client) {
        setUniswapV2GraphClient(client)
        const data = await client.query(`{bundle(id: "1" ) {ethPrice}}`).toPromise()
        const bundle = data.data.bundle
        setETHPriceUSD(parseFloat(bundle?.ethPrice))
      }
    } catch (err) {
      console.log("er", err)
    }
  }, [client])

  return (
    <main className="w-full">
      <Nav />
      <NetworkWarning />
      {searchOpen ? <Search /> : children}
      <ConnectModal />
      <CreateThreadModal />
      <OfferModal />
      <BuyModal />
      <MobileNotificationsModal />
    </main>
  )
}

export default Layout

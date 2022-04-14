import React from "react"
import { useTheme } from "next-themes"
import Modal from "components/Layout/Modal"
import { useDaoStore } from "stores/useDaoStore"
import { chain, defaultChains } from "wagmi"
import { ethers } from "ethers"

import { ChainId } from "@uniswap/sdk"
import { SwapWidget } from "@uniswap/widgets"
import "@uniswap/widgets/fonts.css"

const UniswapSwapModal = () => {
  const setUniswapSwapModalOpen = useDaoStore(state => state.setUniswapSwapModalOpen)
  const closeUniswapSwapModal = () => {
    setUniswapSwapModalOpen(false)
  }

  // review all of this
  // how do we swap from the bbyDAO wallet
  const chainId = ChainId.MAINNET
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  // API key for Ethereum node
  const infuraId = process.env.INFURA_ID
  // Chains for connectors to support
  const chains = defaultChains
  const rpcUrl = chains.find(x => x.id === chainId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0]
  const jsonRpcEndpoint = `${rpcUrl}/${infuraId}`

  const { theme } = useTheme()
  const uniswapTheme = {
    dark: {
      // slate-100
      primary: "#F1F9F5",
      // slate-200
      secondary: "#E2E8F0",
      // bbyDAO teal
      interactive: "#0DB2AC",
      // slate-800
      container: "rgb(30 41 59)",
      // slate-900
      module: "rgb(15 23 42)",
      // bbyDAO orange
      accent: "#FC8D4D",
      outline: "#F1F9F5",
      dialog: "#FFF",
      fontFamily: "M PLUS Rounded 1c",
      borderRadius: 0.8,
    },
    light: {
      // slate-800
      primary: "#1E293B",
      // slate-900
      secondary: "#0F172A",
      // bbyDAO teal
      interactive: "#0DB2AC",
      // slate-100
      container: "#F1F9F5",
      // slate-200
      module: "#E2E8F0",
      // bbyDAO orange
      accent: "#FC8D4D",
      outline: "#F1F9F5",
      dialog: "#FFF",
      fontFamily: "M PLUS Rounded 1c",
      borderRadius: 0.8,
    },
  }

  return (
    <Modal close={closeUniswapSwapModal} heading={"Uniswap Swap"}>
      <div className="Uniswap my-3">
        <SwapWidget
          width={"100%"}
          provider={provider}
          jsonRpcEndpoint={jsonRpcEndpoint}
          theme={theme === "light" ? uniswapTheme.light : uniswapTheme.dark}
        />
      </div>
    </Modal>
  )
}

export default UniswapSwapModal

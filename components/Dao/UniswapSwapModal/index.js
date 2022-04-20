import {SafeEthersSigner}                  from '@gnosis.pm/safe-ethers-adapters'
import React                               from "react"
import { useTheme }                        from "next-themes"
import Modal                               from "components/Layout/Modal"
import { useDaoStore }                     from "stores/useDaoStore"
import { chain, defaultChains, useSigner } from "wagmi"
import { ethers }                          from "ethers"
import useGnosisProxyContract              from "hooks/useGnosisProxyContract"

import Safe, { SafeFactory, SafeAccountConfig, EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import SafeServiceClient from "@gnosis.pm/safe-service-client"

import { ChainId } from "@uniswap/sdk"
import { SwapWidget } from "@uniswap/widgets"

// tested without uniswap css, works locally lets see if it builds
// import "@uniswap/widgets/fonts.css"

let safeSdk

const UniswapSwapModal = ({ safeAddress }) => {
  const setUniswapSwapModalOpen = useDaoStore(state => state.setUniswapSwapModalOpen)
  const closeUniswapSwapModal = () => {
    setUniswapSwapModalOpen(false)
  }

  const [{ data: signer, loading }] = useSigner()
  const [gnosisProvider, setGnosisProvider] = React.useState(null)

  const getContract = async () => {
    const contract = new ethers.Contract(safeAddress, [
      {
        inputs: [{ internalType: "address", name: "_singleton", type: "address" }],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      { stateMutability: "payable", type: "fallback" },
    ])
    const safeService = new SafeServiceClient(
        "https://safe-transaction.gnosis.io/"
    )
    const connected = await contract.connect(safeAddress)
    const connectSigner = await connected.connect(signer)
   // const safeSigner = SafeEthersSigner.create(safeAddress, signer, safeService)
    console.log('safe ethersss', new SafeEthersSigner(safeAddress))

    console.log('safe', safeAddress)
    console.log('signer', signer)
    console.log('safe service', safeService)
   // console.log('safesigner', safeSigner)

    setGnosisProvider(connectSigner.provider)
    // console.log("signer", signer)
    // console.log("connectSigner", connectSigner)
    // console.log("wallet", wallet)
  }

  React.useEffect(() => {
    if (!loading && signer) {
      getContract()
    }
  }, [loading])

  const chainId = ChainId.MAINNET
  const infuraId = process.env.INFURA_ID
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
      container: "#1E293B",
      // slate-900
      module: "#0F172A",
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

  if (gnosisProvider) {
    console.log("gnosisProvider", gnosisProvider)

    return (
      <Modal close={closeUniswapSwapModal} heading={"Uniswap Swap"}>
        <div className="Uniswap my-3">
          {console.log('gn', gnosisProvider)}
          <SwapWidget
            width={"100%"}
            provider={gnosisProvider}
            jsonRpcEndpoint={jsonRpcEndpoint}
            theme={theme === "light" ? uniswapTheme.light : uniswapTheme.dark}
          />
        </div>
      </Modal>
    )
  }

  return (
    <Modal close={closeUniswapSwapModal} heading={"Uniswap Swap"}>
      <div>noope</div>
    </Modal>
  )
}

export default UniswapSwapModal

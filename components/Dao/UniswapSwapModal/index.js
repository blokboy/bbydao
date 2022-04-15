import {ChainId}              from "@uniswap/sdk"
import {SwapWidget}           from "@uniswap/widgets"
import "@uniswap/widgets/fonts.css"
import Modal                  from "components/Layout/Modal"
import useGnosisProxyContract from "hooks/useGnosisProxyContract"
import {useTheme}             from "next-themes"
import React, {useEffect}     from "react"
import {useDaoStore}          from "stores/useDaoStore"
import {chain, defaultChains} from "wagmi"

const UniswapSwapModal = ({safeAddress}) => {
    const setUniswapSwapModalOpen = useDaoStore(state => state.setUniswapSwapModalOpen)
    const closeUniswapSwapModal = () => {
        setUniswapSwapModalOpen(false)
    }
    const [gnosisProvider, setGnosisProvider] = React.useState(null)
    const getGnosisProvider = async () => {
        const contract = await useGnosisProxyContract(safeAddress)
        if (!!contract) {
            const provider = await contract.provider
            await setGnosisProvider(provider)
        }
    }
    getGnosisProvider()


    const chainId = ChainId.MAINNET
    const infuraId = process.env.INFURA_ID
    const chains = defaultChains
    const rpcUrl = chains.find(x => x.id === chainId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0]
    const jsonRpcEndpoint = `${rpcUrl}/${infuraId}`

    const {theme} = useTheme()
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

    return (
        <>
            {!!gnosisProvider && (
                <Modal close={closeUniswapSwapModal} heading={"Uniswap Swap"}>
                    <div className="Uniswap my-3">
                        <SwapWidget
                            width={"100%"}
                            provider={gnosisProvider}
                            jsonRpcEndpoint={jsonRpcEndpoint}
                            theme={theme === "light" ? uniswapTheme.light : uniswapTheme.dark}
                        />
                    </div>
                </Modal>
            )}
        </>
    )
}

export default UniswapSwapModal

import { ChainId } from "@uniswap/sdk"
import { ethers } from "ethers"
import React from "react"
import Modal from "components/Layout/Modal"
import EarnPortal from "components/Dao/EarnPortal"
import TokenCard from "./TokenCard"

const DaoTokensTab = ({ isMember, tokens }) => {
  const WETH = ethers.utils.getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
  const filteredTokens = React.useMemo(() => {
    return tokens?.reduce((acc = [], cv) => {
      if (Number(cv.fiatBalance) > 0) {
        acc.push(cv)
      }

      return acc
    }, [])
  }, [tokens])

  const defaultEth = {
    address: WETH,
    tokenAddress: WETH,
    chainId: ChainId.MAINNET,
    decimals: 18,
    logoURI: "https://v2.info.uniswap.org/static/media/eth.5fc0c9bd.png",
    name: "Ether",
    symbol: "ETH",
  }
  const eth = React.useMemo(() => {
    const eth = filteredTokens?.filter(
      token => token.ethValue === "1.0" && token.token === null && token.tokenAddress === null
    )?.[0]
    if (!!eth) {
      return {
        ...defaultEth,
        balance: eth?.balance,
        ethValue: eth?.ethValue,
        fiatBalance: eth?.fiatBalance,
      }
    }
  }, [filteredTokens])
  const dai = React.useMemo(() => {
    return filteredTokens?.filter(token => token?.token?.symbol === "DAI")?.[0]
  }, [filteredTokens])

  return (
    <div className="flex flex-col">
      <div className="flex items-center py-2 pt-4 text-xl font-thin">
        Treasury
        {/*{eth || dai ? (*/}
        {/*  <Modal*/}
        {/*    heading={*/}
        {/*      <button type="button" className="flex items-center">*/}
        {/*        <div className="mr-4 h-8 w-8 overflow-hidden rounded-full" title="Bancor EarnPortal">*/}
        {/*          <img src={"/babydao.png"} />*/}
        {/*        </div>*/}
        {/*        <div className="flex items-center text-xl font-normal">Deposit & Earn</div>*/}
        {/*      </button>*/}
        {/*    }*/}
        {/*    trigger={*/}
        {/*      <button*/}
        {/*        type="button"*/}
        {/*        className="ml-2 rounded-full bg-orange-600 p-2 px-4 text-sm text-white hover:bg-orange-700"*/}
        {/*      >*/}
        {/*        Earn*/}
        {/*      </button>*/}
        {/*    }*/}
        {/*  >*/}
        {/*    <EarnPortal tokens={{ eth, dai }} />*/}
        {/*  </Modal>*/}
        {/*) : null}*/}
      </div>
      <div className="grid grid-cols-1 gap-2 py-2 xl:grid-cols-2">
        {filteredTokens?.map((token, i) => (
          <TokenCard token={token} isMember={isMember} key={i} />
        ))}
      </div>
    </div>
  )
}

export default DaoTokensTab

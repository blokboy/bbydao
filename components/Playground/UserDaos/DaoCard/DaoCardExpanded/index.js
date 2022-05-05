import React from "react"
import DaoCardNav from "./DaoCardNav"
import DaoTokens from "./DaoTokens"
import DaoNFTs from "./DaoNFTs"
import { usePlaygroundStore } from "/stores/usePlaygroundStore"
import InfoTab from "./InfoTab"

const DaoCardExpanded = ({ isMember, safe, tokens }) => {
  const expandedPanel = usePlaygroundStore(state => state.expandedPanel)

  const panel = React.useMemo(() => {
    if (expandedPanel === "tokens") {
      return <DaoTokens tokens={tokens} />
    }
    if (expandedPanel === "nfts") {
      return <DaoNFTs safe={safe} />
    }

    if (expandedPanel === "info") {
      return <InfoTab safe={safe} />
    }

    return <DaoTokens safe={safe} />
  }, [expandedPanel, safe])

  return (
    <div className="flex flex-col">
      <DaoCardNav safe={safe} />
      {panel}
    </div>
  )
}

export default DaoCardExpanded

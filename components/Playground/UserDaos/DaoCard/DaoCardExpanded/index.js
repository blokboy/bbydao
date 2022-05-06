import React from "react"
import DaoCardNav from "./DaoCardNav"
import DaoTokensTab from "./DaoTokensTab"
import DaoNFTsTab from "./DaoNFTsTab"
import DaoInfoTab from "./DaoInfoTab"
import { usePlaygroundStore } from "/stores/usePlaygroundStore"

const DaoCardExpanded = ({ isMember, safe, tokens }) => {
  const expandedPanel = usePlaygroundStore(state => state.expandedPanel)

  const panel = React.useMemo(() => {
    if (expandedPanel === "tokens") {
      return <DaoTokensTab tokens={tokens} />
    }

    if (expandedPanel === "nfts") {
      return <DaoNFTsTab safe={safe} />
    }

    if (expandedPanel === "info") {
      return <DaoInfoTab safe={safe} />
    }

    return <DaoTokensTab safe={safe} />
  }, [expandedPanel, safe])

  return (
    <div className="flex flex-col">
      <DaoCardNav safe={safe} />
      {panel}
    </div>
  )
}

export default DaoCardExpanded

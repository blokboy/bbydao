import React from "react"
import { useQuery } from "react-query"
import DaoCardNav from "./DaoCardNav"
import DaoTokensTab from "./DaoTokensTab"
import DaoNFTsTab from "./DaoNFTsTab"
import DaoInfoTab from "./DaoInfoTab"
import { usePlaygroundStore } from "/stores/usePlaygroundStore"

const DaoCardExpanded = ({ isMember, safe, tokens }) => {
  const expandedPanel = usePlaygroundStore(state => state.expandedPanel)
  useQuery("expandedDao", () => safe)

  const panel = React.useMemo(() => {
    if (expandedPanel === "tokens") {
      return <DaoTokensTab tokens={tokens} isMember={isMember} />
    }

    if (expandedPanel === "nfts") {
      return <DaoNFTsTab safe={safe} />
    }

    if (expandedPanel === "info") {
      return <DaoInfoTab safe={safe} />
    }

    return <DaoTokensTab safe={safe} isMember={isMember} />
  }, [expandedPanel, safe])

  return (
    <div className="flex flex-col">
      <DaoCardNav safe={safe} />
      {panel}
    </div>
  )
}

export default DaoCardExpanded

import React from "react"
import DaoCardNav from "./DaoCardNav"
import DaoTokens from "./DaoTokens"
import DaoNFTs from "./DaoNFTs"
import { usePlaygroundStore } from '/stores/usePlaygroundStore';

const DaoCardExpanded = ({ isMember, safe }) => {

  const expandedPanel = usePlaygroundStore(state => state.expandedPanel)

  const panel = React.useMemo(() => {
    if (expandedPanel === "tokens") {
      return <DaoTokens safe={safe} />
    }
    if (expandedPanel === "nfts") {
      return <DaoNFTs safe={safe} />
    }
    return <DaoTokens safe={safe} />
  },[expandedPanel, safe])

  return (
    <div className="flex flex-col">
      <DaoCardNav safe={safe}/>
      {panel}
    </div>
  )
}

export default DaoCardExpanded

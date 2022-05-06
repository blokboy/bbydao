import React from "react"
import { MdOutlineCrib } from "react-icons/md"
import { usePlaygroundStore } from "stores/usePlaygroundStore"

const DaoPfpIcon = ({ safe }) => {
  const daoExpanded = usePlaygroundStore(state => state.daoExpanded)
  const setDaoExpanded = usePlaygroundStore(state => state.setDaoExpanded)
  const setExpandedDao = usePlaygroundStore(state => state.setExpandedDao)
  const setExpandedPanel = usePlaygroundStore(state => state.setExpandedPanel)

  const handleExpand = React.useCallback(() => {
    if (daoExpanded) {
      setExpandedPanel("info")
      return
    }
    setDaoExpanded()
    setExpandedDao(safe)
    setExpandedPanel("info")
  }, [])

  return (
    <div className="absolute space-y-1">
      <button
        className="z-50 flex h-8 w-8 items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-white shadow hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-700"
        aria-label={"Nursery Info"}
        onClick={() => handleExpand()}
      >
        <MdOutlineCrib />
      </button>
    </div>
  )
}

export default DaoPfpIcon

import React, {useCallback} from "react"
import Image                from "next/image"
import { MdOutlineCrib }    from "react-icons/md"
import { HiExternalLink }   from "react-icons/hi"
import {usePlaygroundStore} from 'stores/usePlaygroundStore'

const DaoPfpIcon = ( {safe}) => {
  // follow button if not following
  // uniswap button if user is an owner of the dao

  // maybe instead this could serve as an emoji status indicator, or a link to dao page
    const setDaoExpanded = usePlaygroundStore(state => state.setDaoExpanded)
    const setExpandedDao = usePlaygroundStore(state => state.setExpandedDao)
    const setExpandedPanel = usePlaygroundStore(state => state.setExpandedPanel)


    const handleExpand = useCallback(() => {
        setDaoExpanded()
        setExpandedDao(safe)
        setExpandedPanel("info")

    }, [])

  return (
    <div className="absolute space-y-1">
      <button
          className="flex h-8 w-8 items-center justify-center rounded-full border text-white z-50 border-slate-400 bg-slate-200 p-1 shadow hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-700"
          aria-label={'Nursery Info'}
          onClick={() => handleExpand()}
      >
          <MdOutlineCrib />
      </button>
    </div>
  )
}

export default DaoPfpIcon

import React from "react"
import ClickAwayListener from "react-click-away-listener"

const NFTCard = ({ nft }) => {
  const [isExpanded, setExpanded] = React.useState(false)

  const handleClick = e => {
    e.preventDefault()
    setOsAssetInfo({
      address: nft.address,
      token_id: nft.id,
      image_url: nft.imageUri,
      sellOrder: null,
    })
    setOsSellModalOpen(true)
  }

  const handleExpand = React.useCallback(() => {
    if (!isExpanded) {
      setExpanded(true)
    }
  }, [isExpanded])

  const handleCollapse = React.useCallback(() => {
    if (isExpanded) {
      setExpanded(false)
    }
  }, [isExpanded])

  const containerClasses = React.useMemo(() => {
    return `flex w-full ${isExpanded ? "col-span-3" : ""}`
  }, [isExpanded])

  const nftName = React.useMemo(() => {
    return (nft.name || nft.metadata.name) ?? null
  }, [nft])

  const nftImageSrc = React.useMemo(() => {
    return nft.imageUri ?? null
  }, [nft])

  const nftCardName = React.useMemo(() => {
    return nftName !== null ? (
      <div className="mt-2 pl-2 text-sm font-bold">
        {nft.name?.length < 16 ? nft.name : `${nft.name?.slice(0, 16)}...`}
      </div>
    ) : null
  }, [nftName])

  const nftExpandedImg = React.useMemo(() => {
    return nftImageSrc ? (
      <img
        className="rounded-xl object-contain lg:mt-2 lg:h-40 lg:w-40"
        src={nftImageSrc}
        alt=""
      />
    ) : null
  }, [nftImageSrc])

  const nftCardImg = React.useMemo(() => {
    return nftImageSrc ? (
      <img
        className="h-24 w-24 overflow-hidden rounded-xl bg-white object-contain shadow-lg lg:h-40 lg:w-40 dark:bg-black"
        src={nftImageSrc}
        alt=""
      />
    ) : (
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-white object-contain font-bold dark:bg-black">
        NFT
      </div>
    )
  }, [nftImageSrc])

  const nftTraits = React.useMemo(() => {
    if (!nft.metadata.attributes) {
      return null
    }

    return nft.metadata.attributes.length ? (
      <ul className="mt-4 flex flex-wrap">
        {nft.metadata.attributes.map(attr => (
          <li className="mr-2 mt-2 rounded-xl bg-slate-300 py-2 px-4 text-sm lowercase text-gray-800">
            {attr.value}
          </li>
        ))}
      </ul>
    ) : null
  }, [nft.metadata.attributes])

  const nftContent = React.useMemo(() => {
    return isExpanded ? (
      <ClickAwayListener onClickAway={handleCollapse}>
        <div className="w-full items-center rounded-xl bg-slate-100 p-4 shadow-lg dark:bg-slate-700">
          <div className="w-full">
            <strong className="text-lg">{nftName}</strong>
          </div>

          <div className="mt-4 flex flex-col lg:mt-0 lg:flex-row">
            <div className="w-full lg:mr-4 lg:w-1/3">{nftExpandedImg}</div>

            <div className="mt-4 w-full lg:mt-0 lg:w-2/3">
              <p className="mt-2">{nft.description}</p>
              {nftTraits}
            </div>
          </div>

          <div className="mt-8 rounded-full bg-slate-200 shadow hover:shadow-lg dark:bg-slate-800">
            <button
              type="button"
              className="w-full rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] bg-clip-text p-4 font-semibold text-transparent"
            >
              buy or bid
            </button>
          </div>
        </div>
      </ClickAwayListener>
    ) : (
      <div className="flex flex-col w-full items-center">
        <button type="button" onClick={handleExpand}>
          {nftCardImg}
        </button>
        {nftCardName}
      </div>
    )
  }, [isExpanded])

  return <div className={containerClasses}>{nftContent}</div>
}

export default NFTCard
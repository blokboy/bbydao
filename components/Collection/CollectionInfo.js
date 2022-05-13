import React from "react"
import { FaEthereum, FaDonate } from "react-icons/fa"
import { HiBadgeCheck } from "react-icons/hi"

const CollectionInfo = ({
  address,
  name,
  description,
  numOwners,
  totalSupply,
  verified,
  floor,
  avg,
  volume,
  ticker,
}) => {
  const [isFullDescription, setFullDescription] = React.useState(false)

  const descriptionText = React.useMemo(() => {
    return (
      <p className="break-word overflow-hidden p-4">
        {isFullDescription ? description : `${description.slice(0, 180)}...`}
      </p>
    )
  }, [isFullDescription])

  const showLess = React.useCallback(() => {
    if (isFullDescription) {
      setFullDescription(false)
    }
  }, [isFullDescription])

  const showMore = React.useCallback(() => {
    if (!isFullDescription) {
      setFullDescription(true)
    }
  }, [isFullDescription])

  const statsClasses =
    "p-4 flex flex-col lg:w-full items-center justify-center w-1/2"

  const collectionName = React.useMemo(() => {
    return (
      <div className="mr-4 w-full max-w-xs text-2xl">
        <span className="mr-2">{name}</span>
        {verified ? <HiBadgeCheck className="inline text-blue-400" /> : null}
      </div>
    )
  }, [name, verified])

  return (
    <div className="mt-2 flex w-full flex-col rounded-xl bg-slate-100 p-4 shadow dark:bg-slate-800 lg:sticky lg:top-4">
      <div className="relative px-4">
        {collectionName}
        {ticker ? <div className="mt-2">${ticker}</div> : null}
        <button
          type="button"
          className="absolute top-1 right-1 text-xl hover:shadow-lg"
        >
          <FaDonate />
        </button>
      </div>

      <ul className="mt-4 flex flex-wrap items-center justify-between lg:flex-nowrap">
        <li className={statsClasses}>
          <div>{totalSupply}</div>
          <div>items</div>
        </li>
        <li className={statsClasses}>
          <div>{numOwners}</div>
          <div>owners</div>
        </li>
        <li className={statsClasses}>
          <div className="flex items-center">
            <FaEthereum />
            {floor}
          </div>
          <div>floor</div>
        </li>
        <li className={statsClasses}>
          <div className="flex items-center">
            <FaEthereum />
            {Math.floor(Number(volume)).toLocaleString("en-us")}
          </div>
          <div>volume</div>
        </li>
      </ul>

      {descriptionText}
      <button type="button" onClick={isFullDescription ? showLess : showMore}>
        {isFullDescription ? "show less" : "show more"}
      </button>
    </div>
  )
}

export default CollectionInfo

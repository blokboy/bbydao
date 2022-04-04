import React from "react"
import { FaEthereum } from "react-icons/fa"
import { HiBadgeCheck } from "react-icons/hi"

const CollectionInfo = ({
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
      <p className="p-4">
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
    "p-4 flex flex-col w-full items-center justify-center"

  return (
    <div className="sticky top-4 flex w-full flex-col rounded-xl bg-slate-100 p-4 shadow dark:bg-slate-800">
      <div className="flex items-center justify-center text-center text-2xl">
        <div className="mr-4">{name}</div>
        <div className="mr-4"> - </div>
        <div className="font-mono">${ticker}</div>
      </div>

      <ul className="mt-4 flex items-center justify-between">
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

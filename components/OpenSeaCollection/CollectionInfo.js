import React from "react"
import { HiBadgeCheck } from "react-icons/hi"

const CollectionInfo = ({
  name,
  description,
  numOwners,
  totalSupply,
  verified,
  floor,
  avg,
  volume
}) => {
  const [isReadMore, setIsReadMore] = React.useState(true)
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }

  return (
    <div className="flex w-full flex-col rounded-xl border border-white p-3">
      <div className="ml-1 flex h-full w-full flex-row items-center">
                  <span className="mr-1 text-2xl underline font-semibold">{name}</span>
                  {verified ? (
                    <HiBadgeCheck className="text-blue-400" />
                  ) : (
                    <></>
                  )}
      </div>
      
      <div className="mt-4 flex w-full flex-row p-3">
      <span className="mr-1 text-lg font-semibold">{numOwners} Owners</span>
      <span className="mr-1 text-lg font-semibold">{totalSupply} Supply</span>
      <span className="mr-1 text-lg font-semibold">{floor.toFixed(1)}E Floor</span>
      <span className="mr-1 text-lg font-semibold">{avg.toFixed(1)}E Price</span>
      <span className="mr-1 text-lg font-semibold">{volume.toFixed(1)}E Volume</span>
      </div>

      <div className="">
        {isReadMore && description ? description?.slice(0, 150) : <></>}

        {description?.length > 150 && (
          <button className="text-blue-400" onClick={toggleReadMore}>
            {isReadMore ? " ...read more" : " ...show less"}
          </button>
        )}
      </div>

    </div>
  )
}

export default CollectionInfo

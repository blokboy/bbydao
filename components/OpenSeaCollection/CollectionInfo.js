import React from "react"

const CollectionInfo = ({
  name,
  description,
  numOwners,
  totalSupply,
  verified,
}) => {
  const [isReadMore, setIsReadMore] = React.useState(true)
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }

  return (
    <div className="flex w-full flex-col p-3">
      <h1 className="flex w-full justify-center text-5xl">{name}</h1>
      <div>owners: {numOwners}</div>
      <div>total supply: {totalSupply}</div>
      <div>verified: {verified}</div>

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

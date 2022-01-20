import React from "react"

const CollectionInfo = ({ name, description }) => {
  const [isReadMore, setIsReadMore] = React.useState(true)
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }

  return (
    <div className="flex flex-col w-full border border-white rounded-xl p-3">
      <h1 className="flex text-5xl w-full justify-center">{name}</h1>
      <div className="">
        {isReadMore ? description.slice(0, 150) : description}

        {description.length > 150 && (
          <button className="text-blue-400" onClick={toggleReadMore}>
            {isReadMore ? " ...read more" : " ...show less"}
          </button>
        )}
      </div>
    </div>
  )
}

export default CollectionInfo

import React from "react"
import Link from "next/link"

const DaoDetail = ({ safe }) => {
  if (!safe) {
    return <></>
  }

  return (
    <>
      <Link href={safe ? `/dao/${safe}` : "/"}>
        <a>
          <div className="bg-gray-200 h-36 w-36 md:h-40 md:w-40 rounded-full dark:bg-gray-900"></div>
        </a>
      </Link>
    </>
  )
}

export default DaoDetail

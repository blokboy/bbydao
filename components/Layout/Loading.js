import React from "react"
import Image from "next/image"

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen font-bold">
      <div className="motion-safe:animate-[bounce_3s_ease-in-out_infinite]">
        <Image alt="" src="/babydao.png" width={200} height={200} />
      </div>
      <h1>loading...</h1>
    </div>
  )
}

export default Loading

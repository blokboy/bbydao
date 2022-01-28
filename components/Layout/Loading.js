import React from "react"

const Loading = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center font-bold">
      <div className="motion-safe:animate-[bounce_3s_ease-in-out_infinite]">
        <img alt="" src="/babydao.png" width={200} height={200} />
      </div>
      <h1 className="animation animate-pulse text-xl">loading...</h1>
    </div>
  )
}

export default Loading

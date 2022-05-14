import React from "react"
import CanvasPfp from '../CanvasPfp';
import { useEnsAvatar } from 'wagmi'

const Pfp = ({address}) => {
  const { data, isError, isLoading } = useEnsAvatar({addressOrName: address})
  
  return (
    <div className="flex flex-row w-full justify-center">
      <div className="flex items-center justify-center rounded-full h-36 w-36 overflow-clip border border-white">
        {data ? <img src={data} alt={address} /> : <CanvasPfp />}
      </div>
    </div>
  )
}

export default Pfp

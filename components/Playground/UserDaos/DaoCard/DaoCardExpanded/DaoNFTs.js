import React from "react"
import * as api from "/query/gnosisQuery"
import { useQuery } from "react-query"

const DaoNFTs = ({ safe }) => {
  const {
    data: daoNFTsData,
    error: daoNFTsErr,
    isLoading: daoNFTsLoading,
  } = useQuery(["daoNFTs", safe], () => api.daoNFTs(safe), { staleTime: 200000, refetchOnWindowFocus: false })

  if (!daoNFTsData?.length) {
    return (
      <div className="flex flex-col w-full items-center justify-center h-20">
        <div className="text-xl">No NFTs...yet</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="text-xl">nfts</div>
      <div className="grid grid-cols-2 gap-2">
        {daoNFTsData?.map((nft, i) => (
          <div key={i} className="p-2">
            <img src={nft.imageUri} alt={nft.name} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DaoNFTs

import React from "react"
import AssetCard from "./AssetCard"

const assets = [
  {
    token_id: "9999",
    num_sales: 1,
    background_color: null,
    image_url:
      "https://lh3.googleusercontent.com/CrSXeD3t60EdSZqBPSdzU82aA9zd5n5W5ap0Feg1efE7dB4NHjFU2sHTLAhem22Hezt9PSIPWFQUGoG_TJBzccwPGpzwyXoGbOHJtQ",
    image_thumbnail_url:
      "https://lh3.googleusercontent.com/CrSXeD3t60EdSZqBPSdzU82aA9zd5n5W5ap0Feg1efE7dB4NHjFU2sHTLAhem22Hezt9PSIPWFQUGoG_TJBzccwPGpzwyXoGbOHJtQ=s128",
    image_original_url:
      "https://ipfs.io/ipfs/QmVdZcdjS5fAzqzH4nMeKrqEhZM6Kjf6EgRDhxZEemEjJM",
    animation_url: null,
    animation_original_url: null,
    name: "Doodle #9999",
    permalink:
      "https://opensea.io/assets/0x8a90cab2b38dba80c64b7734e58ee1db38b8992e/9999",
    decimals: 0,
    token_metadata:
      "https://ipfs.io/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/9999",
    owner: "0x4301b45f31bf7b511859c6be04bcef2c5100a112",
    sell_orders: null,
    creator: "0x2b3ab8e7bb14988616359b78709538b10900ab7d",
    creator_status: "verified",
    traits: [
      {
        trait_type: "head",
        value: "yellow",
        display_type: null,
        max_value: null,
        trait_count: 944,
        order: null,
      },
      {
        trait_type: "body",
        value: "pink fleece",
        display_type: null,
        max_value: null,
        trait_count: 317,
        order: null,
      },
      {
        trait_type: "face",
        value: "aviators with mustache",
        display_type: null,
        max_value: null,
        trait_count: 153,
        order: null,
      },
      {
        trait_type: "hair",
        value: "blue messy",
        display_type: null,
        max_value: null,
        trait_count: 250,
        order: null,
      },
      {
        trait_type: "background",
        value: "blue",
        display_type: null,
        max_value: null,
        trait_count: 726,
        order: null,
      },
    ],
  },
  {
    token_id: "9994",
    background_color: null,
    image_url:
      "https://lh3.googleusercontent.com/4Cn6kanrELh7rinQWq6nrt4iJUsNnQGemt7Cd6O__gjuYTHqi-Je4LJuMu8SmYKGxvhhpMxnFwwPMGkZrYfvvPon_QN2sD2ZavUC8g",
    image_thumbnail_url:
      "https://lh3.googleusercontent.com/4Cn6kanrELh7rinQWq6nrt4iJUsNnQGemt7Cd6O__gjuYTHqi-Je4LJuMu8SmYKGxvhhpMxnFwwPMGkZrYfvvPon_QN2sD2ZavUC8g=s128",
    image_original_url:
      "https://ipfs.io/ipfs/QmYBYWMwGcyn1GoettFnn4yzpzRUwtaYrt3XscsxcyN6hD",
    animation_url: null,
    animation_original_url: null,
    name: "Doodle #9994",
    permalink:
      "https://opensea.io/assets/0x8a90cab2b38dba80c64b7734e58ee1db38b8992e/9994",
    decimals: 0,
    token_metadata:
      "https://ipfs.io/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/9994",
    owner: "0x9d546e20cd75b62276787a1e4db2b9393633e2d6",
    creator: "0x2b3ab8e7bb14988616359b78709538b10900ab7d",
    creator_status: "verified",
    traits: [
      {
        trait_type: "face",
        value: "happy",
        display_type: null,
        max_value: null,
        trait_count: 744,
        order: null,
      },
      {
        trait_type: "background",
        value: "fire",
        display_type: null,
        max_value: null,
        trait_count: 313,
        order: null,
      },
      {
        trait_type: "head",
        value: "pink",
        display_type: null,
        max_value: null,
        trait_count: 970,
        order: null,
      },
      {
        trait_type: "hair",
        value: "purple cap",
        display_type: null,
        max_value: null,
        trait_count: 279,
        order: null,
      },
      {
        trait_type: "body",
        value: "yellow turtleneck",
        display_type: null,
        max_value: null,
        trait_count: 354,
        order: null,
      },
    ],
  },
]

const AssetList = () => {
  return (
    // <div className="flex h-full w-full p-3">
    <div className="mx-4 grid w-full grid-cols-1 justify-items-center gap-3 p-3 md:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset, index) => (
        <>
          <AssetCard key={index} asset={asset} />
          <AssetCard key={index} asset={asset} />
          <AssetCard key={index} asset={asset} />
          <AssetCard key={index} asset={asset} />
          <AssetCard key={index} asset={asset} />
        </>
      ))}
    </div>
    // </div>
  )
}

export default AssetList

import React from "react"
import Collection from "components/Collection"
import { request, gql } from "graphql-request"

const endpoint = "https://api.zora.co/graphql"

const CollectionPage = ({ data,  }) => {
  return <Collection data={data} />
}

export default CollectionPage

export const getServerSideProps = async ({ query }) => {
  const address = Array(query.address)
  if (!address) return 

  const req = gql`
  query Collection ($collectionAddresses: [String!]!){
    collections(where: {collectionAddresses: $collectionAddresses}) {
      nodes {
        name
        description
        totalSupply
        symbol
        networkInfo {
          chain
          network
        }
        address
      }
    }
    aggregateStat {
      ownerCount(where: {collectionAddresses: $collectionAddresses})
      floorPrice(where: {collectionAddresses: $collectionAddresses})
      salesVolume(where: {collectionAddresses: $collectionAddresses}) {
        totalCount
        usdcPrice
        chainTokenPrice
      }
    }
  }
  `

  const variables = {
    collectionAddresses: address
  }

  const data = await request(
    endpoint,
    req,
    variables,
  )

  return {props: {data}}
}

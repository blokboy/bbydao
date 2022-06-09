import { request, gql } from "graphql-request"

const endpoint = "https://api.zora.co/graphql"

// { text: string }
export const searchZoraCollections = async query => {
  if (!query) return 

  const req = gql`
  query SearchCollections($text: String!) {
    search(filter: {entityType: COLLECTION}, pagination: {limit: 10}, query: {text: $text}) {
      nodes {
        collectionAddress
        name
      }
    }
  }
  `

  const variables = {
    text: query
  }

  const data = await request(
    endpoint,
    req,
    variables,
  )

  return data?.search?.nodes
}

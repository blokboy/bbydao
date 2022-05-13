import React from "react"
import axios from "axios"
import Collection from "components/Collection"

const CollectionPage = ({ data, slug }) => {
  return <Collection data={data} slug={slug} />
}

export default CollectionPage

export const getServerSideProps = async ({ query }) => {
  const slug = query.slug
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/collection/fetch`,
      {
        slug: slug,
        address: query.address,
      }
    )
    const collection = res.data
    return { props: { data: collection, slug: slug } }
  } catch (error) {
    console.log(error)
    return { props: { data: null } }
  }
}

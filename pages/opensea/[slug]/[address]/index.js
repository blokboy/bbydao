import React from "react"
import axios from "axios"
import OpenSeaCollection from "components/OpenSeaCollection"

const OpenSeaPage = ({ data }) => {
  return <OpenSeaCollection data={data} />
}

export default OpenSeaPage

export const getServerSideProps = async ({ query }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/collection/fetch`,
      {
        slug: query.slug,
        address: query.address,
      }
    )
    const collection = res.data
    return { props: { data: collection } }
  } catch (error) {
    console.log(error)
    return { props: { data: undefined } }
  }
}

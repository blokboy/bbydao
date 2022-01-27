import React from "react"
import axios from "axios"
import OpenSeaCollection from "components/OpenSeaCollection"

const OpenSeaPage = ({ data }) => {
  return <OpenSeaCollection data={data} />
}

export default OpenSeaPage

OpenSeaPage.getInitialProps = async ({ query }) => {
  try {
    // process.env not working? -- plain api url works
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/collection/fetch`,
      {
        slug: query.slug,
        address: query.address,
      }
    )
    const collection = res.data
    return { data: collection }
  } catch (error) {
    console.log(error)
    return { data: null }
  }
}

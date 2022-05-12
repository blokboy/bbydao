import axios from "axios"
import React from "react"
import Playground from "/components/Playground"

const index = ({ address, data }) => {
  return <Playground address={address} data={data} />
}

export default index

export const getServerSideProps = async ({ query }) => {
  const address = query.address
  try {
    const res = await axios.get(`https://safe-transaction.gnosis.io/api/v1/owners/${address}/safes/`)
    const data = await res.data
    return {
      props: {
        address,
        data,
      },
    }
  } catch (error) {
    console.log(error)
    return { props: {} }
  }
}

import React from "react"
import axios from "axios"
import UserDashboard from "../../../components/UserDashboard/index"

const UserPage = ({ data }) => {
  return (
    <>
      <UserDashboard data={data} />
    </>
  )
}

export default UserPage

UserPage.getInitialProps = async ({ query }) => {
  const res = await axios.post(`${process.env.accounts_api}`, {
    username: query.username,
  })
  const user = await res.data
  return { data: user }
}

import React from "react"
import UserDashboard from "../../../components/UserDashboard/index"

const UserPage = ({ data }) => {
  return (
    <>
      <UserDashboard data={data} />
    </>
  )
}

export default UserPage

UserPage.getInitialProps = async ({ pathname }) => {
  const res = await fetch(
    `${process.env.accounts_api}`,
    { method: "POST" },
    { username: pathname }
  )
  const user = await res.json()
  return { data: user }
}

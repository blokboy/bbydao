import React from "react"

const UserPage = ({ data }) => {
  return (
    <>
      {/* render userdashboard, passing data down as a prop?
    conditionally render within components that make up
    the userdashboard to distinguish between user profile 
    and friends/other users profiles */}

      <div>{data.username}</div>
      <div>{data.address}</div>
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

import axios from "axios"
import UserDashboard from "components/UserDashboard/index"

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
    address: query.address,
  })
  const user = res.data
  return { data: user }
}

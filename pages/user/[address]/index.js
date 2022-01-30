import axios from "axios"
import UserDashboard from "components/UserDashboard/index"
import SafeServiceClient from "@gnosis.pm/safe-service-client"

const UserPage = ({ data }) => {
  return <UserDashboard data={data} />
}

export default UserPage

export const getServerSideProps = async ({ query }) => {
  try {
    const safeService = new SafeServiceClient(
      "https://safe-transaction.gnosis.io"
    )
    const safes = await safeService.getSafesByOwner(query.address)

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/accounts/account`,
      {
        address: query.address,
      }
    )
    const user = res.data

    if (safes.length) {
      const safeCreationInfo = await safeService.getSafeCreationInfo(
        safes.safes[0]
      )

      return { props: { data: { user, safes, safeCreationInfo } } }
    }

    return { props: { data: { user, safes } } }
  } catch (error) {
    // return error
  }
}

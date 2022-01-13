import axios from "axios"
import UserDashboard from "components/UserDashboard/index"
import SafeServiceClient from "@gnosis.pm/safe-service-client"

import { useRouter } from "next/router"
import { useConnect } from "wagmi"

const UserPage = ({ data }) => {
  const router = useRouter()
  const [{ data: connectData, error, loading }, connect] = useConnect()

  if (!connectData.connected) {
    router.push("/")
  }

  return <UserDashboard data={data} />
}

export default UserPage

UserPage.getInitialProps = async ({ query }) => {
  const safeService = new SafeServiceClient(
    "https://safe-transaction.gnosis.io"
  )
  const safes = await safeService.getSafesByOwner(query.address)

  const res = await axios.post(`${process.env.accounts_api}`, {
    address: query.address,
  })
  const user = res.data

  if (safes.length) {
    const safeCreationInfo = await safeService.getSafeCreationInfo(
      safes.safes[0]
    )

    return { data: { user, safes, safeCreationInfo } }
  }

  return { data: { user, safes } }
}

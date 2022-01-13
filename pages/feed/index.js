import Feed from "components/Feed"
import { useRouter } from "next/router"
import { useConnect } from "wagmi"

const Index = () => {
  const router = useRouter()
  const [{ data: connectData, error, loading }, connect] = useConnect()

  if (!connectData.connected) {
    router.push("/")
  }

  return <Feed />
}

export default Index

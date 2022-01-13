import Messages from "components/Messages"
import { useRouter } from "next/router"
import { useConnect } from "wagmi"

const Index = () => {
  const router = useRouter()
  const [{ data: connectData, error, loading }, connect] = useConnect()

  if (!connectData.connected) {
    router.push("/")
  }

  return <Messages />
}

export default Index

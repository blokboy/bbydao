import Messages from "components/Messages"
import { useConnect } from "wagmi"

const Index = () => {
  const [{ data: connectData, error, loading }, connect] = useConnect()

  return <Messages />
}

export default Index

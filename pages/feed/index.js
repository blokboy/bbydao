import Feed from "components/Feed"
import { useConnect } from "wagmi"

const Index = () => {
  const [{ data: connectData, error, loading }, connect] = useConnect()

  return <Feed />
}

export default Index

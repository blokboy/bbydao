import UserSettingsForm from "components/Forms/UserSettingsForm"
import { useRouter } from "next/router"
import { useConnect } from "wagmi"

const Settings = () => {
  const router = useRouter()
  const [{ data: connectData, error, loading }, connect] = useConnect()

  if (!connectData.connected) {
    router.push("/")
  }

  return <UserSettingsForm />
}

export default Settings

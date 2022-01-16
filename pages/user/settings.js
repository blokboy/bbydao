import UserSettingsForm from "components/Forms/UserSettingsForm"
import { useConnect } from "wagmi"

const Settings = () => {
  const [{ data: connectData, error, loading }, connect] = useConnect()

  return <UserSettingsForm />
}

export default Settings

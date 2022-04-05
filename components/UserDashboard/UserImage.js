import React from "react"
import Davatar from "@davatar/react"

const UserImage = ({ address }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    if (mounted) return
    setMounted(true)
  }, [])

  const davatar = React.useMemo(() => {
    return (
      <Davatar size={175} address={address} generatedAvatarType="blockies" />
    )
  }, [mounted, address])

  return <div className="mb-3 flex place-content-center">{davatar}</div>
}

export default UserImage

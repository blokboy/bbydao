import React from "react"
import DaoForm from "components/Forms/DaoForm"
import { useRouter } from "next/router"
import { useConnect } from "wagmi"

const Create = () => {
  const router = useRouter()
  const [{ data: connectData, error, loading }, connect] = useConnect()

  if (!connectData.connected) {
    router.push("/")
  }

  return <DaoForm />
}

export default Create

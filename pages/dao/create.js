import React from "react"
import DaoForm from "components/Forms/DaoForm"
import { useConnect } from "wagmi"

const Create = () => {
  const [{ data: connectData, error, loading }, connect] = useConnect()

  return <DaoForm />
}

export default Create

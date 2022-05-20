import React from "react"
import * as api from "query"
import { useMutation, useQuery } from "react-query"
import { EthersAdapter, SafeFactory } from "@gnosis.pm/safe-core-sdk"
import { useSigner } from "wagmi"
import { ethers } from "ethers"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import Select from "react-select"
import { customStyles } from "./customStyles"

const Input = ({ name }) => {
  return (
    <Field
      className="focus:shadow-outline w-full appearance-none rounded border bg-slate-100 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
      id="name"
      name={name}
      placeholder={name}
    />
  )
}

const NurseryForm = () => {
  const { data: signer } = useSigner()
  const address = React.useMemo(() => {
    if (!signer) {
      return null
    }
    return signer?._address
  }, [signer])

  return (
    <div>NurseryForm</div>
  )
}

export default NurseryForm
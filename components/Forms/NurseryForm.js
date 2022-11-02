import React from "react"
import { Field, Form, Formik, useFormik } from "formik"
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

const validationSchema = Yup.object().shape({
  name: Yup.string().min(1, "Name is too short!").required("Required"),
  invites: Yup.array().min(1, "you need at least one friend!").required("Required"),
})

const NurseryForm = () => {
  const [txWaiting, setTxWaiting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const daos = [
    { value: "candy", label: "candy" },
    { value: "apple", label: "apple" },
    { value: "red", label: "red" },
    { value: "paint", label: "paint" },
  ]

  const handleSubmit = ({ preventDefault }) => {
    preventDefault()
    simulateNurseryCreation()
  }

  if (txWaiting) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mt-10 motion-safe:animate-[bounce_3s_ease-in-out_infinite]">
          <img alt="" src="/babydao.png" width={200} height={200} />
        </div>
        <h1 className="animation animate-pulse text-xl">please check your wallet...</h1>
      </div>
    )
  }

  const simulateNurseryCreation = () => {
    setTxWaiting(true)
  }

  return (
    <Formik
      onSubmit={values => handleSubmit({ ...values })}
      validationSchema={validationSchema}
      enableReinitialize={true}
    >
      {({ values, isSubmitting, setFieldValue, errors }) => (
        <fieldset className="h-full w-full" disabled={isSubmitting}>
          <form
            className="flex flex-col p-4"
            onSubmit={e => {
              e.preventDefault()
              setTxWaiting(true)
            }}
          >
            <div className="flex justify-between items-center">
              <div className="w-full">
                <h2 className="font-bold mb-3">trusted</h2>
                {errors.invites ? <div className="p-2">{errors.invites}</div> : null}
                <label className="block text-sm font-bold" htmlFor="invites">
                  select from your daos
                </label>
                <Select
                  // defaultValue={}
                  styles={customStyles}
                  isMulti
                  name="daos"
                  options={daos}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={e => {
                    const selectedDaos = e.map(option => option.value)
                    console.log("daos", selectedDaos)
                  }}
                />
              </div>
              <div className="w-full">
                <h2 className="font-bold mb-3">trustless</h2>
                {errors.invites ? <div className="p-2">{errors.invites}</div> : null}
                <label className="block text-sm font-bold" htmlFor="invites">
                  select from your daos
                </label>
                <Select
                  // defaultValue={}
                  styles={customStyles}
                  isMulti
                  name="daos"
                  options={daos}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={e => {
                    const selectedDaos = e.map(option => option.value)
                    console.log("daos", selectedDaos)
                  }}
                />
              </div>
            </div>
            <div className="mb-8">
              {errors.name ? <div className="p-2">{errors.name}</div> : null}
              <label className="mb-2 block text-sm font-bold" htmlFor="name">
                name
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border bg-slate-100 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
                type="text"
                id="name"
                name="name"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                className="focus:shadow-outline mb-3 w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
                type="submit"
              >
                create
              </button>
            </div>
          </form>
        </fieldset>
      )}
    </Formik>
  )
}

const NurseryFormNew = () => {
  const [txWaiting, setTxWaiting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const formik = useFormik({
    initialValues: {
      trustedDaos: [],
      trustlessDaos: [],
      name: ''
    },
    onSubmit: values => {

      const allDaos = [...values.trustedDaos, ...values.trustlessDaos]

      alert(JSON.stringify({
        daos: allDaos,
        name: values.name
      }, null, 2))
    },
  })

  const daos = [
    {
      value: {
        name: "candy",
        members: 10,
      },
      label: "candy",
    },
    {
      value: {
        name: "apple",
        members: 10,
      },
      label: "apple",
    },
    {
      value: {
        name: "red",
        members: 10,
      },
      label: "red",
    },
    {
      value: {
        name: "paint",
        members: 10,
      },
      label: "paint",
    },
  ]

  const handleSubmit = ({ preventDefault }) => {
    preventDefault()
    simulateNurseryCreation()
  }

  if (txWaiting) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mt-10 motion-safe:animate-[bounce_3s_ease-in-out_infinite]">
          <img alt="" src="/babydao.png" width={200} height={200} />
        </div>
        <h1 className="animation animate-pulse text-xl">please check your wallet...</h1>
      </div>
    )
  }

  const simulateNurseryCreation = () => {
    // alert(JSON.stringify())
    setTxWaiting(true)
  }
  return (
    <form onSubmit={formik.handleSubmit} validationSchema={validationSchema} enableReinitialize={true}>
      <fieldset className="h-full w-full">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <h2 className="font-bold mb-3">trusted</h2>
            <label className="block text-sm font-bold" htmlFor="invites">
              select from your daos
            </label>
            <Select
              styles={customStyles}
              isMulti
              id="trustedDaos"
              name="trustedDaos"
              options={daos}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={e => {
                const selectedTrustedDaos = e.map(option => ({...option.value, isTrusted: true}))
                console.log("trusted daos", selectedTrustedDaos)
                formik.setFieldValue('trustedDaos', selectedTrustedDaos)
              }}
            />
          </div>
          <div className="w-full">
            <h2 className="font-bold mb-3">trustless</h2>
            <label className="block text-sm font-bold" htmlFor="invites">
              select from your daos
            </label>
            <Select
              styles={customStyles}
              isMulti
              id="trustlessDaos"
              name="trustlessDaos"
              options={daos}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={e => {
                const selectedTrustlessDaos = e.map(option => ({...option.value, isTrusted: false}))
                console.log("trustless daos", selectedTrustlessDaos)
                formik.setFieldValue('trustlessDaos', selectedTrustlessDaos)
              }}
            />
          </div>
        </div>
        <div className="mb-8">
          <label className="mb-2 block text-sm font-bold" htmlFor="name">
            name
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border bg-slate-100 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
            type="text"
            id="name"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="focus:shadow-outline mb-3 w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
            type="submit"
          >
            create
          </button>
        </div>
      </fieldset>
    </form>
  )
}

export default NurseryFormNew

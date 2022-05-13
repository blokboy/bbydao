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

const DaoForm = () => {
  const { data: signer } = useSigner()
  const address = React.useMemo(() => {
    if (!signer) {
      return null
    }
    return signer?._address
  }, [signer])

  const { data: friendData } = useQuery(["friends", address], () => api.getFriends({ initiator: address }), {
    refetchOnWindowFocus: false,
    staleTime: 180000,
    enabled: !!signer,
  })

  const parsedList = React.useMemo(() => {
    let list = []
    if (friendData) {
      for (const friend of friendData) {
        // relationship status = 4 (follower)
        // & the address of the profile being viewed is not the initiator of the relationship
        if (friend.status === 4 && friend.initiator !== address) {
          list.push(friend)
        } else {
          null
        }
      }
    }
    return list
  }, [friendData])

  const friends = parsedList?.map(friend => {
    return {
      value: friend.initiator === address ? friend.target : friend.initiator,
      label: friend.initiator === address ? friend.targetEns || friend.target : friend.initiatorEns,
    }
  })
  
  const { status, mutateAsync: createDao } = useMutation(api.createDao)
  const [txWaiting, setTxWaiting] = React.useState(false)

  const createBabyDao = React.useCallback(
    async (ownerList, signer) => {
      if (!signer) {
        return
      }
      try {
        const ethAdapter = new EthersAdapter({
          ethers,
          signer,
        })
        const safeFactory = await SafeFactory.create({ ethAdapter })
        const owners = ownerList
        const threshold = ownerList.length === 2 ? 2 : Math.ceil(ownerList.length / 2)
        const safeAccountConfig = {
          owners,
          threshold,
        }
        return await safeFactory.deploySafe(safeAccountConfig)
      } catch (err) {
        console.log("err", err)
      }
    },
    [signer]
  )

  const handleSubmit = React.useCallback(
    async ({ invites, name, signer }) => {
      try {
        const ownerList = [address, ...invites]
        setTxWaiting(true)
        const bbyDao = await createBabyDao(ownerList, signer)
        const bbyDaoAddress = await bbyDao.getAddress()
        // request to backend with dao info
        const req = {
          name,
          type: 1,
          address: bbyDaoAddress,
          members: ownerList,
        }
        await createDao(req)
        setTxWaiting(false)
      } catch (err) {
        console.log(err)
      }
    },
    [createDao, address]
  )

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

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1, "Name is too short!").required("Required"),
    invites: Yup.array().min(1, "you need at least one friend!").required("Required"),
  })

  return (
    <Formik
      initialErrors={{}}
      initialValues={{
        invites: [],
        name: "",
        signer,
      }}
      onSubmit={values => handleSubmit({ ...values })}
      validationSchema={validationSchema}
      enableReinitialize={true}
    >
      {({ values, isSubmitting, setFieldValue, errors }) => (
        <fieldset className="h-full w-full" disabled={isSubmitting}>
          <Form className="flex flex-col p-4">
            <div className="w-full">
              {errors.invites ? <div className="p-2">{errors.invites}</div> : null}
              <label className="p-2 block text-sm font-bold" htmlFor="invites">
                invite friends
              </label>
              <p className="p-2 text-xs">select from your friends</p>
              <Select
                // defaultValue={}
                styles={customStyles}
                isMulti
                name="invites"
                options={friends}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={e => {
                  const selectedAddresses = e.map(option => option.value)
                  setFieldValue("invites", selectedAddresses)
                }}
              />
            </div>
            <div className="mb-8">
              {errors.name ? <div className="p-2">{errors.name}</div> : null}
              <label className="mb-2 block text-sm font-bold" htmlFor="name">
                name
              </label>
              <Input name={"name"} />
            </div>

            <div className="flex items-center justify-between">
              <button
                className="focus:shadow-outline mb-3 w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
                type="submit"
              >
                save
              </button>
            </div>
          </Form>
        </fieldset>
      )}
    </Formik>
  )
}

export default DaoForm

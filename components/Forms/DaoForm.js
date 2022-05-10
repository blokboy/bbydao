import React from "react"
import Select from "react-select"
import { customStyles } from "./customStyles"
import useForm from "hooks/useForm"
import { useConnect, useAccount } from "wagmi"
import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import { Safe, SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"
import * as api from "query"
import { useQuery, useMutation } from "react-query"

const DaoForm = () => {
  const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount()
  let address = accountData?.address

  const [txWaiting, setTxWaiting] = React.useState(false)
  const { state, setState, handleChange } = useForm()
  const [selectedOptions, setSelectedOptions] = React.useState([])
  const [{ data, error }, connect] = useConnect()

  const { data: friendData } = useQuery(["friends", address], () => api.getFriends({ initiator: address }), {
    refetchOnWindowFocus: false,
    staleTime: 180000,
  })

  const { status, mutateAsync } = useMutation(api.createDao)

  const friends = friendData?.map(friend => {
    return {
      value: friend.initiator === address ? friend.target : friend.initiator,
      label: friend.initiator === address ? friend.targetEns || friend.target : friend.initiatorEns,
    }
  })

  const handleSelectedOptions = options => {
    const selectedAddresses = options.map(option => option.value)
    setSelectedOptions(selectedAddresses)
  }

  const createBabyDao = async (e, ownerList) => {
    if (!address) {
      console.log("DaoForm.js no owner address")
      return
    }
    await window.ethereum.enable()
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const owner1 = provider.getSigner(0)
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: owner1,
    })
    const safeFactory = await SafeFactory.create({ ethAdapter })
    const owners = ownerList
    const threshold = ownerList.length === 2 ? 2 : Math.ceil(ownerList.length / 2)
    const safeAccountConfig = {
      owners,
      threshold,
    }
    const safeSdk = await safeFactory.deploySafe(safeAccountConfig)
    return safeSdk
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!selectedOptions.length) {
      console.log("please select at least one friend")
      return
    }
    const ownerList = [address, ...selectedOptions]
    setTxWaiting(true)
    const bbyDao = await createBabyDao(e, ownerList)
    console.log("DaoForm.js bbyDao", bbyDao)

    // request to backend with dao info
    const req = {
      name: state.name,
      type: 1,
      address: bbyDao.getAddress(),
      members: ownerList,
    }
    mutateAsync(req)
    setTxWaiting(false)
    // closeModal()
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

  return (
      <form
        className="flex h-full w-full flex-col p-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="mb-2 block text-sm font-bold" htmlFor="invites">
            invite friends
          </label>
          <p className="mb-2 text-xs">select from your friends</p>
          <Select
            // defaultValue={}
            styles={customStyles}
            isMulti
            name="invites"
            options={friends}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleSelectedOptions}
          />
        </div>

        <div className="mb-8">
          <label className="mb-2 block text-sm font-bold" htmlFor="name">
            name
          </label>
          <input
            value={state?.name}
            onChange={handleChange}
            className="focus:shadow-outline w-full appearance-none rounded border bg-slate-100 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
            id="name"
            name="name"
            type="text"
            placeholder="name"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="focus:shadow-outline mb-3 w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
            type="submit"
          >
            save
          </button>
        </div>
      </form>
  )
}

export default DaoForm

import React from "react"
import useForm from "hooks/useForm"
import { useUiStore } from "stores/useUiStore"
import { useConnect, useWaitForTransaction } from "wagmi"
import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import { Safe, SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"

const DaoForm = ({ address }) => {
  const { state, setState, handleChange } = useForm()

  const [{ data, error }, connect] = useConnect()
  const [{ data: waitData, error: waitError, loading }, wait] =
    useWaitForTransaction()

  const createDaoModalOpen = useUiStore(state => state.createDaoModalOpen)
  const setCreateDaoModalOpen = useUiStore(state => state.setCreateDaoModalOpen)

  const createBabyDao = async (e, ownerList, userThreshold = 2) => {
    if (!address) {
      console.log("DaoForm.js no owner address")
      return
    }

    await window.ethereum.enable()

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const owner1 = provider.getSigner(0)

    const ethAdapter = new EthersAdapter({
      ethers,
      signer: owner1,
    })
    console.log("ethAdapter", ethAdapter)

    const safeFactory = await SafeFactory.create({ ethAdapter })
    console.log("safeFactory ", safeFactory)

    const owners = ownerList // addresses must be checksummed
    const threshold = ownerList.length
    const safeAccountConfig = {
      owners,
      threshold,
    }

    const safeSdk = await safeFactory.deploySafe(safeAccountConfig)
    console.log("safe sdk ", safeSdk)

    return safeSdk
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const ownerList = [address, state.invite]
    console.log(ownerList)
    await createBabyDao(e, ownerList)
    // once createBabyDao runs, use name, type and address to create dao
    // await createDao(state.name, type = 1, address)
    setState({})
  }

  const closeModal = e => {
    if (!createDaoModalOpen && e.target) {
      return
    }
    setState({})
    setCreateDaoModalOpen()
  }

  if (!createDaoModalOpen) return <></>

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      {data.connected ? (
        <form
          className="z-50 mx-auto mt-0 flex h-full w-full flex-col bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24 md:h-auto md:w-6/12 md:rounded-xl"
          onSubmit={handleSubmit}
          onClick={e => closeModal(e)}
        >
          <div className="mb-8 w-full text-center text-xl font-bold">
            create your dao
          </div>

          {loading ? (
            <span className="text-yellow-500">
              useWaitForTransaction loading...
            </span>
          ) : (
            <></>
          )}

          {waitError ? (
            <span className="text-red-500">useWaitForTransaction ERROR</span>
          ) : (
            <></>
          )}

          {waitData ? (
            <span className="text-green-500">
              useWaitForTransaction data success
            </span>
          ) : (
            <></>
          )}

          <div className="mb-8">
            <label className="mb-2 block text-sm font-bold" htmlFor="name">
              name
            </label>
            <input
              value={state.name || ""}
              onChange={handleChange}
              className="focus:shadow-outline w-full appearance-none rounded border bg-slate-200 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
              id="name"
              name="name"
              type="text"
              placeholder="name"
            />
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-bold" htmlFor="name">
              about
            </label>
            <div className="h-56">
              <textarea
                value={state.about || ""}
                onChange={handleChange}
                id="about"
                name="about"
                className="focus:shadow-outline h-full w-full appearance-none rounded border bg-slate-200 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
                type="textarea"
                placeholder="enter a short description"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-bold" htmlFor="name">
              invite friends
            </label>
            <p className="mb-2 text-xs">separate usernames with comma</p>
            <input
              value={state.invite || ""}
              onChange={handleChange}
              id="invite"
              name="invite"
              className="focus:shadow-outline w-full appearance-none rounded border bg-slate-200 py-2 px-3 leading-tight shadow focus:outline-none dark:bg-slate-800"
              type="text"
              placeholder="@username"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline w-full rounded-xl bg-slate-200 py-3 px-4 font-bold shadow-xl focus:outline-none dark:bg-slate-800"
              type="submit"
            >
              save
            </button>
          </div>
        </form>
      ) : (
        <></>
      )}
    </div>
  )
}

export default DaoForm

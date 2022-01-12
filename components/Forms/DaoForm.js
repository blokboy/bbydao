import React from "react"
import useForm from "hooks/useForm"
import { useUiStore } from "stores/useUiStore"
import { useConnect, useWaitForTransaction, useContractEvent } from "wagmi"
import { ethers } from "ethers"
import { EthersAdapter } from "@gnosis.pm/safe-core-sdk"
import { Safe, SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk"

import contracts from "../../ABIs/contracts.json"

const DaoForm = ({ address }) => {
  const { state, handleChange } = useForm()

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
  }

  const closeModal = e => {
    if (!createDaoModalOpen && e.target) {
      return
    }
    setCreateDaoModalOpen()
  }

  if (!createDaoModalOpen) return <></>

  return (
    <div
      className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={e => closeModal(e)}
    >
      {data.connected ? (
        <form
          className="flex flex-col mt-24 mx-auto z-50 rounded shadow-xl w-full md:w-3/6 md:rounded-xl px-8 pt-6 pb-8 mb-4 bg-gray-100 dark:bg-gray-900"
          onSubmit={handleSubmit}
          onClick={e => closeModal(e)}
        >
          <div className="w-full text-xl text-center font-bold mb-8">
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
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              name
            </label>
            <input
              value={state.name || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
              id="name"
              name="name"
              type="text"
              placeholder="name"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              about
            </label>
            <div className="h-56">
              <textarea
                value={state.about || ""}
                onChange={handleChange}
                id="about"
                name="about"
                className="shadow appearance-none border rounded w-full h-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
                type="textarea"
                placeholder="enter a short description"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              invite friends
            </label>
            <p className="text-xs mb-2">separate usernames with comma</p>
            <input
              value={state.invite || ""}
              onChange={handleChange}
              id="invite"
              name="invite"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 dark:bg-gray-800"
              type="text"
              placeholder="@username"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="w-full font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline shadow-xl bg-gray-200 dark:bg-gray-800"
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

import React from "react"
import Head from "next/head"
import UserImage from "./UserImage"
import UserDetails from "./UserDetails"
import UserFriends from "./UserFriends"
import CreateDaoPrompt from "./CreateDaoPrompt"
import UserDaos from "./UserDaos"
import DaoForm from "../Forms/DaoForm"
import { useUiStore } from "stores/useUiStore"
import * as api from "../../query"
import { useMutation } from "react-query"
import { useEnsLookup, useAccount } from "wagmi"
import CreateDaoButton from "./CreateDaoButton"
import UserStats from "./UserStats"

const UserDashboard = ({ data }) => {
  const { id, address, ens } = data.user
  const { safes } = data.safes
  const balances = data.safeBalanceInfo

  const createDaoModalOpen = useUiStore(state => state.createDaoModalOpen)

  const [
    { data: ensData, error: ensError, loading: ensLoading },
    lookupAddress,
  ] = useEnsLookup({
    address: address,
  })
  const [
    { data: accountData, error: accountError, loading: accountLoading },
    disconnect,
  ] = useAccount()

  const { status, mutateAsync } = useMutation(api.updateUser)

  React.useEffect(() => {
    if (!ens && !ensLoading && ensData) {
      mutateAsync({ id: id, ens: ensData })
    }
    return
  }, [ensData])

  return (
    <>
      <Head>
        <title>{`babydao | ${address.substring(0, 6)}...`}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {data ? (
        <>
          {createDaoModalOpen ? <DaoForm address={address} /> : <></>}
          <div className="mt-5 flex h-screen w-full flex-col pb-10 md:flex-row">
            <div className="flex-start flex flex-col px-4 md:w-3/12 md:px-10">
              <UserImage address={address} />
              <UserDetails address={address} ens={ens} />
              {address === accountData?.address ? (
                <div className="flex w-full justify-center md:justify-start">
                  <CreateDaoButton />
                </div>
              ) : (
                <></>
              )}
              <UserFriends address={address} />
              <UserStats address={address} balances={balances} />
            </div>
            <div className="flex flex-col px-10 md:w-9/12">
              {safes.length ? (
                <UserDaos address={address} safes={safes} />
              ) : address === accountData?.address ? (
                <CreateDaoPrompt />
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default UserDashboard

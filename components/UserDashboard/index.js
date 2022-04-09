import React                        from "react"
import Head                         from "next/head"
import { walletSnippet }            from "../../utils/helpers"
import UserImage                    from "./UserImage"
import UserDetails                  from "./UserDetails"
import CreateDaoPrompt              from "./CreateDaoPrompt"
import UserDaos                     from "./UserDaos"
import DaoForm                      from "../Forms/DaoForm"
import { useUiStore }               from "stores/useUiStore"
import * as api                     from "../../query"
import { useMutation }              from "react-query"
import { useEnsLookup, useAccount } from "wagmi"
import CreateDaoButton from "./CreateDaoButton"
import UserDelegateList from "./UserDelegateList"
import UserStats from "./UserStats"
import UserFeed from "./UserFeed"

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

  if (!data) {
    return
  }

  return (
    <>
      <Head>
        <title>{`bbyDAO | ${walletSnippet(address)}`}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full flex-col pt-4 md:flex-row">
        <div className="flex-start flex flex-1 flex-col px-4 md:w-3/12">
          <UserImage address={address} />
          <UserDetails address={address} ens={ens} />
          {address === accountData?.address ? (
            <>
              <div className="flex w-full justify-center">
                <CreateDaoButton />
              </div>
            </>
          ) : null}
          <div className="flex w-full justify-center">
            <UserDelegateList safes={safes} />
          </div>
        </div>
        <div className="flex flex-col md:w-9/12 md:flex-row">
          <div className="flex w-full flex-col md:w-1/2">
            <UserFeed address={address} />
          </div>
          <div className="flex w-full flex-col md:w-1/2">
            {safes.length ? (
              <UserDaos address={address} safes={safes} />
            ) : address === accountData?.address && !safes.length ? (
              <CreateDaoPrompt />
            ) : null}
          </div>
        </div>
      </div>
      {createDaoModalOpen && <DaoForm address={address} />}
    </>
  )
}

export default UserDashboard

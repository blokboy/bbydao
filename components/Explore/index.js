import React from "react"
import Head from "next/head"
import Splash from "./Splash"
import ProfilesContainer from "./ProfilesContainer"
import * as api from "query"
import { useMutation } from "react-query"
import { useAccountStore } from "stores/useAccountStore"
import SignModal from "components/SignModal"

const Explore = ({ accountData }) => {
  const { status, mutateAsync } = useMutation(api.getUser)

  const userData = useAccountStore(state => state.userData)
  const setUserData = useAccountStore(state => state.setUserData)
  const setRainbowAccount = useAccountStore(state => state.setRainbowAccount)

  const [incomingUser, setIncomingUser] = React.useState({
    id: null,
    confirmed: null,
  })

  const handleRequest = req => {
    mutateAsync(req, {
      onSuccess: res => {
        const { address, id, confirmed } = res.data
        setUserData(res.data)
        setRainbowAccount(address)
        console.log("explore logged in:", res.data)

        setIncomingUser({ id: id, confirmed: confirmed })
      },
    })
  }

  React.useEffect(() => {
    if (!accountData) return

    const req = {
      address: accountData.address,
      ens: accountData.ens?.name ? accountData.ens.name : null,
      ensAvatar: accountData.ens?.avatar ? accountData.ens.avatar : null,
    }

    handleRequest(req)
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <>
      <Head>
        <title>babydao</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {userData?.confirmed ? <SignModal incomingUser={incomingUser} /> : <></>}

      <div className="flex flex-col w-screen">
        <Splash />
        <ProfilesContainer />
      </div>
    </>
  )
}

export default Explore

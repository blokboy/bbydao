import React from "react"
import Head from "next/head"
import Explore from "components/Explore"
import { useConnect, useAccount } from "wagmi"

const Home = () => {
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    if (mounted) {
      return
    }
    setMounted(true)
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <>
      <Head>
        <title>babydao</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Explore accountData={accountData} />
    </>
  )
}

export default Home

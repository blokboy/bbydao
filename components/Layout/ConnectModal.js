import { useRouter }              from "next/router"
import React                      from "react"
import { useUiStore }             from "stores/useUiStore"
import { useConnect, useAccount } from "wagmi"
import { HiX }                    from "react-icons/hi"

const ConnectModal = () => {
  const router = useRouter()
  const {pathname} = router
  const isLanding = pathname === '/'
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const connectModalOpen = useUiStore(state => state.connectModalOpen)
  const setConnectModalOpen = useUiStore(state => state.setConnectModalOpen)

  const closeModal = e => {
    if (!connectModalOpen && e.target) {
      return
    }
    setConnectModalOpen()
  }

  const connectButtons = React.useMemo(() => {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mb-3 text-3xl sm:text-5xl">Welcome to babydao</h1>
        <p className="mb-3">Get started by connecting your wallet </p>
        {data.connectors.map(connector =>
          connector.ready ? (
            <button
              className="mb-4 w-3/4 rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow hover:bg-gradient-to-l"
              key={connector.id}
              onClick={async () => {
                const connected = await connect(connector)
                if(connected?.data?.account.length > 0 && isLanding) {
                    router.push(`/user/${connected?.data.account}`)
                }
              }}
            >
              <span className="block rounded-full bg-slate-200 px-8 py-3 font-medium text-black hover:bg-opacity-50 dark:bg-slate-900 dark:text-white dark:hover:bg-opacity-75">
                {connector.name}
                {!connector.ready && " (unsupported)"}
              </span>
            </button>
          ) : (
            <button
              className="my-2 rounded-xl border bg-zinc-500 py-3 px-6"
              key={connector.id}
            >
              {connector.name}
              {!connector.ready && " (unsupported)"}
            </button>
          )
        )}

        {error && <div>{error?.message ?? "Failed to connect"}</div>}
      </div>
    )
  }, [data]) /* eslint-disable-line react-hooks/exhaustive-deps */

  if (!connectModalOpen || accountData) return <></>

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      <div
        className="z-50 mx-auto mt-0 flex h-full w-full flex-col bg-slate-200 px-4 py-2 shadow dark:bg-slate-900 md:mt-24 md:h-auto md:w-6/12 md:rounded-xl"
        onClick={e => closeModal(e)}
      >
        <div className="flex w-full justify-end">
          <button className="modal-close-btn" onClick={e => closeModal(e)}>
            <HiX />
          </button>
        </div>
        {connectButtons}
      </div>
    </div>
  )
}

export default ConnectModal

import React from "react"
import { useUiStore } from "stores/useUiStore"
import { useConnect, useAccount } from "wagmi"

const ConnectModal = () => {
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
              className="mb-4 w-2/4 rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow hover:bg-gradient-to-l"
              key={connector.id}
              onClick={() => connect(connector)}
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

  if (!connectModalOpen) return <></>

  return (
    <div
      className="fixed inset-0 z-40 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-50"
      onClick={e => closeModal(e)}
    >
      <div className="z-50 mx-auto mt-24 mb-4 flex w-full flex-col rounded bg-slate-100 px-8 pt-6 pb-8 shadow-xl dark:bg-slate-900 md:w-3/6 md:rounded-xl">
        {connectButtons}
      </div>
    </div>
  )
}

export default ConnectModal

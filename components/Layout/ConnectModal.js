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
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl sm:text-5xl mb-3">Welcome to babydao</h1>
        <p className="mb-3">Get started by connecting your wallet </p>
        {data.connectors.map(connector =>
          connector.ready ? (
            <button
              className="shadow p-0.5 rounded-full bg-gradient-to-r hover:bg-gradient-to-l from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] mb-4 w-2/4"
              key={connector.id}
              onClick={() => connect(connector)}
            >
              <span className="block px-8 py-3 font-medium text-black dark:text-white bg-gray-200 dark:bg-gray-900 rounded-full hover:bg-opacity-50 dark:hover:bg-opacity-75">
                {connector.name}
                {!connector.ready && " (unsupported)"}
              </span>
            </button>
          ) : (
            <button
              className="border rounded-xl bg-zinc-500 my-2 py-3 px-6"
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
      className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={e => closeModal(e)}
    >
      <div className="flex flex-col mt-24 mx-auto z-50 rounded shadow-xl w-full md:w-3/6 md:rounded-xl px-8 pt-6 pb-8 mb-4 bg-gray-100 dark:bg-gray-900">
        {connectButtons}
      </div>
    </div>
  )
}

export default ConnectModal

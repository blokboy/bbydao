import React from "react"
import { createPortal } from "react-dom"
import Davatar from "@davatar/react"
import { useAccount } from "wagmi"

const DaoPfp = ({ address, imgUri, members }) => {
  const [{ data: account }] = useAccount()

  const [isOpen, setOpen] = React.useState(false)

  const isMember = React.useMemo(() => {
    if (!account || !members) {
      return false
    }

    return members.includes(account.address)
  }, [account, members])

  const openModal = React.useCallback(() => (!isOpen ? setOpen(true) : {}), [isOpen])

  const closeModal = React.useCallback(() => (isOpen ? setOpen(false) : {}), [isOpen])

  const modal = React.useMemo(() => {
    return isOpen
      ? createPortal(
          <div
            role="document"
            aria-modal={true}
            className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur"
          >
            <div className="w-full max-w-md rounded-xl bg-slate-200 p-4 shadow-lg dark:bg-slate-900">
              <h2 className="text-center">Update bbyDAO Profile Picture</h2>
              <p className="mt-2 text-center font-light">Choose from any of your bbyDAO's NFTs</p>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-54 rounded-lg border shadow-lg px-4 py-2 text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.querySelector("body")
        )
      : null
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        className={`flex h-36 w-36 items-center justify-center overflow-clip rounded-full border border-white duration-200 hover:scale-[1.05] ${
          !isMember ? "pointer-events-none" : ""
        }`}
        disabled={!isMember}
        onClick={openModal}
      >
        <Davatar size={144} address={address} generatedAvatarType="blockies" />
      </button>
      {modal}
    </>
  )
}

export default DaoPfp

import React from "react"
import Modal from "components/Layout/Modal"
import { useLayoutStore } from "stores/useLayoutStore"

const MintErrorModal = ({ error }) => {
  const setMintErrorModal = useLayoutStore(state => state.setMintErrorModal)

  const closeMintErrorModal = () => {
    setMintErrorModal(false)
  }

  return (
    <Modal close={closeMintErrorModal} heading={"Error"}>
      <div className="flex h-16 w-full items-center justify-center rounded-xl border border-red-300 p-3 my-6">
        {error ? error : null}
      </div>
    </Modal>
  )
}

export default MintErrorModal

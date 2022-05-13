import React from "react"
import { createPortal } from "react-dom"
import Davatar from "@davatar/react"
import { useAccount } from "wagmi"
import { useRouter } from "next/router"
import { useMutation, useQueryClient } from "react-query"

import * as api from "query"
import useCollectibles from "hooks/useCollectibles"

const DaoPfp = ({ address, imgUri, members, daoId }) => {
  const { data: account } = useAccount()
  const router = useRouter()

  const [{ data: collectibles }, getCollectibles] = useCollectibles(address, { skip: true })

  const [isOpen, setOpen] = React.useState(false)
  const [selectedImg, setSelectedImg] = React.useState(null)

  const { mutateAsync: updateDao } = useMutation(api.updateDao, {
    onSuccess: () => {
      setOpen(false)
      router.reload()
    },
  })

  const isMember = React.useMemo(() => {
    if (!account || !members) {
      return false
    }

    return members.includes(account.address)
  }, [account, members])

  const openModal = React.useCallback(() => (!isOpen ? setOpen(true) : {}), [isOpen])

  const closeModal = React.useCallback(() => (isOpen ? setOpen(false) : {}), [isOpen])

  const selectImg = React.useCallback(
    imgUri => {
      if (imgUri !== selectedImg) {
        setSelectedImg(imgUri)
      }
    },
    [selectedImg]
  )

  const deselectImg = React.useCallback(() => {
    setSelectedImg(null)
  }, [])

  const handleUpdate = React.useCallback(() => {
    if (!selectedImg || !daoId) {
      return
    }
    updateDao({ id: daoId, imgUri: selectedImg })
  }, [selectedImg, daoId, updateDao])

  const handleRemoval = React.useCallback(() => {
    if (!imgUri || !daoId) {
      return
    }
    updateDao({ id: daoId, imgUri: null })
  }, [imgUri, daoId])

  React.useEffect(() => {
    if (isMember) {
      getCollectibles()
    }
  }, [isMember, getCollectibles])

  const modal = React.useMemo(() => {
    return isOpen
      ? createPortal(
          <div
            role="document"
            aria-modal={true}
            className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur"
          >
            <div className="w-full max-w-2xl rounded-xl bg-slate-200 px-4 py-8 shadow-lg dark:bg-slate-900">
              <h2 className="text-center text-lg">Update bbyDAO Profile Picture</h2>
              <p className="mt-2 text-center font-light">Choose from any of your bbyDAO's NFTs</p>
              <ul className="mt-8 h-72 overflow-y-scroll md:grid md:w-auto md:grid-cols-3 md:gap-4">
                {collectibles.map(nft => (
                  <li key={nft.address} className="mt-4 w-full px-4 md:mt-0 md:w-auto">
                    <button
                      type="button"
                      onClick={selectedImg === nft.imageUri ? () => deselectImg() : () => selectImg(nft.imageUri)}
                      className={`m-auto flex h-full h-48 w-full flex-col items-center justify-center rounded border border-2 border-transparent p-4 duration-200 hover:border-black md:w-48 ${
                        selectedImg === nft.imageUri ? "border-black" : ""
                      }`}
                    >
                      {nft.imageUri ? (
                        <img src={nft.imageUri} alt="" className="h-[100px] w-[100px] rounded-full" />
                      ) : null}
                      <strong className="mt-4 text-center">{nft.name}</strong>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col-reverse items-center justify-center md:flex-row">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-4 w-full rounded-lg bg-slate-100 px-4 py-2 text-center font-bold shadow-lg dark:bg-slate-600 md:mt-0 md:mr-4 md:w-32"
                >
                  cancel
                </button>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-center font-bold text-white shadow-lg disabled:opacity-75 md:mr-4 md:mt-0 md:w-32"
                  disabled={imgUri === null}
                  onClick={handleRemoval}
                >
                  remove
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-center font-bold text-white shadow-lg disabled:opacity-75 md:w-32"
                  onClick={handleUpdate}
                  disabled={selectedImg === null}
                >
                  update
                </button>
              </div>
            </div>
          </div>,
          document.querySelector("body")
        )
      : null
  }, [isOpen, selectedImg, selectImg, deselectImg, handleUpdate, imgUri, handleRemoval])

  const imgDisplay = React.useMemo(() => {
    return imgUri ? (
      <img src={imgUri} alt="" className="h-auto w-full" />
    ) : (
      <Davatar size={144} address={address} generatedAvatarType="blockies" />
    )
  }, [imgUri])

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
        {imgDisplay}
      </button>
      {modal}
    </>
  )
}

export default DaoPfp

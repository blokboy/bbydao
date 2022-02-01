import React from "react"
import { useUiStore } from "stores/useUiStore"
import { MdAdd } from "react-icons/md"
import CreateDaoButton from "./CreateDaoButton"

const CreateDaoPrompt = () => {
  const setCreateDaoModalOpen = useUiStore(state => state.setCreateDaoModalOpen)

  return (
    <div className="mt-10 flex w-full flex-col items-center">
      <span className="text-2xl font-bold">
        Create a new dao to get started
      </span>
      <CreateDaoButton />
    </div>
  )
}

export default CreateDaoPrompt

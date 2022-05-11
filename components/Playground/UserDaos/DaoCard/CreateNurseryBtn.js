import React from 'react'
import dynamic from "next/dynamic"
const Modal = dynamic(() => import("components/Layout/Modal"), { ssr: false })
import NurseryForm from 'components/Forms/NurseryForm'

const CreateNurseryBtn = () => {
  return (
      <Modal
        heading={"create your nursery"}
        trigger={
          <button className="-transform-y-6 flex h-6 w-auto items-center justify-center rounded-full border border-slate-400 bg-slate-200 p-1 text-xs shadow hover:border-teal-300 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-600">
          create nursery
        </button>
        }
      >
        <NurseryForm />
      </Modal>
  )
}

export default CreateNurseryBtn
import React from "react"
import dynamic from "next/dynamic"
const Modal = dynamic(() => import("components/Layout/Modal"), { ssr: false })
import DaoForm from "components/Forms/DaoForm"

const CreateBbyDaoBtn = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <Modal
        heading={"create your bbyDAO"}
        trigger={
          <button
            type="button"
            className="flex w-36 flex-row rounded-lg bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
          >
            <span className="flex w-full items-center justify-center rounded-lg bg-slate-200 font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
              create bbyDAO
            </span>
          </button>
        }
      >
        <DaoForm />
      </Modal>
    </div>
  )
}

export default CreateBbyDaoBtn

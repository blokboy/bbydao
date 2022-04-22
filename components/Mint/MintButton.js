import { useRouter }        from "next/router"
import React, { useEffect } from "react"
import { useConnect }       from "wagmi"
import { FaEthereum } from "react-icons/fa"

const MintButton = () => {
  const [{ data, error }, connect] = useConnect()

  return (
      <div className="relative">
        <button
          className="mr-3 flex w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
          onClick={console.log('clicked')}
        >
          <span className="block rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
            mint!
          </span>
        </button>
      </div>
  )
}

export default MintButton

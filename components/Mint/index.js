import React, { useContext, useState } from "react"
import { useConnect, useAccount } from "wagmi"
import { useTheme } from "next-themes"
import MintButton from "./MintButton"

const Mint = ({ children }) => {
  const { theme, setTheme } = useTheme()
  const [count, setCount] = useState(1)
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const handleSubtract = async e => {
    e.preventDefault()
    if (count > 1) {
      setCount(count - 1)
      return
    }
    return
  }

  const handleAddition = async e => {
    e.preventDefault()
    if (theme === "light") {
      if (count < 20) {
        setCount(count + 1)
        return
      }
    }

    if (theme === "dark") {
      if (count < 3) {
        setCount(count + 1)
        return
      }
    }
    return
  }

  const Counter = () => {
    return (
      <div className="mr-3 flex w-max flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow dark:hover:bg-slate-700">
        <div className="cursor-pointer select-none rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
          <span
            className="cursor-pointer select-none bg-transparent px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:text-white"
            onClick={e => handleSubtract(e)}
          >
            -
          </span>
          {count}
          <span
            className="cursor-pointer select-none bg-transparent px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:text-white"
            onClick={e => handleAddition(e)}
          >
            +
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* grid 1 */}
      <div className="flex flex-col items-center justify-center p-10">
        <div className="text-4xl md:text-6xl"> BbyDAO Card Collection </div>
        <div className="text-l mt-3">
          To mint one of 500 available bbyDAO {theme && theme === "light" ? "White" : "Black"} Cards, switch to
          {theme && theme === "light" ? "light" : "night"} mode
        </div>
      </div>
      {/* grid 2 */}
      <div className="flex flex-col overflow-visible bg-contain bg-right-top bg-no-repeat p-10">
        <img src={`/mint/${theme && theme === "light" ? "light_card" : "night_card"}.png`} alt="bbyDao Card" />
      </div>
      {/* grid 3 */}
      <div className="flex flex-col p-10">
        <img
          src={`/mint/${theme && theme === "light" ? "bby_3d_layer_light" : "bby_3d_layer_night"}.png`}
          alt="bbyDao 3D"
        />
      </div>
      {/* grid 4 */}
      <div className="flex flex-col items-start justify-center p-10">
        <div className="text-5xl md:text-6xl">What Is It?</div>
        <div className="text-l mt-3">
          The bbyDAO Card Collection is a unique offering of platform ownership in the form on an NFT. When held in one
          of your bbyDAO wallet, UI/UX changes in app will reflect new funcitonality afforded to holders.
        </div>
        <div className="text-l mt-3">
          The bbyDAO {theme && theme === "light" ? "White" : "Black"} Card allows a user to interface with an in
          platform Nursery for {theme && theme === "light" ? "White" : "Black"} Card holders, as well as claim a share
          of rewards from the bbyDAO treasury.
        </div>
      </div>
      {/* grid 5 */}
      <div className="flex flex-col items-start justify-center p-10">
        <div className="text-5xl md:text-6xl">Governance & Yield </div>
        <p className="text-l mt-3">
          20% of platform fees are claimable by holders for both cards (10% White / 10% Black)
        </p>
      </div>
      <div className="flex flex-col p-10">
        <img
          src={`/mint/${theme && theme === "light" ? "card_content_light" : "card_content_night"}.png`}
          alt="bbyDao 3D"
        />
      </div>
      {/* grid 6 */}
      <div className="flex flex-col p-10">
        <img
          src={`/mint/${theme && theme === "light" ? "bby_3d_layer_light" : "bby_3d_layer_night"}.png`}
          alt="bbyDao 3D"
        />
      </div>
      {/* grid 7 */}
      <div className="flex flex-col items-start justify-center p-10">
        <p className="text-5xl md:text-6xl"> Pricing </p>
        <p className="mt-3 mb-3 text-xl">
          {Number(`${theme && theme === "light" ? 0.08 : 0.8}` * count).toFixed(2)} E
        </p>
        <div className="flex flex-row">
          <Counter />
          <MintButton />
        </div>
      </div>
    </div>
  )
}

export default Mint

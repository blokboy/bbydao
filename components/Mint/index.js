import React, { useContext, useState } from 'react'
import { useConnect, useAccount } from "wagmi"
import { useTheme } from 'next-themes'
import MintButton from './MintButton'

const Mint = ({ children }) => {
    const { theme, setTheme } = useTheme()
    const [count, setCount] = useState(1)
    const [{ data, error }, connect] = useConnect()
    const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
    })

    const handleSubtract = async (e) => {
        e.preventDefault();
        if(count > 1) {
            setCount(count - 1)
            return
        }

        return
    }

    const handleAddition = async (e) => {
        e.preventDefault();
        if(theme === 'light') {
            if(count < 20) {
                setCount(count + 1)
                return
            }
        }

        if(theme === 'dark') {
            if(count < 3) {
                setCount(count + 1)
                return
            }
        }

        return
    }

    const Counter = () => {
        return (
              <div
                className="mr-3 flex flex-row w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 dark:hover:bg-slate-700">
             
              <div className="rounded-full select-none cursor-pointer bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
              <span 
              className="select-none cursor-pointer bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75"
              onClick={(e) => handleSubtract(e)}
              >
                -
              </span>
                { count }
              <span 
              className="select-none cursor-pointer bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75"
              onClick={(e) => handleAddition(e)}
              >
                +
              </span>
              </div>
             
              </div>
        )
    }
    
    return (
    <main className="h-full w-full dark:bg-slate-900">
        <div className="flex flex-col z-30">
            <div className="flex flex-row h-screen relative">
                <div className="flex flex-col justify-center items-start md:px-20 md:w-1/2">
                    <p className="text-6xl"> BbyDAO Card Collection </p>
                    {
                        theme && theme === 'light' ? 
                        <p className="text-l mt-3"> To mint one of 500 available bbyDAO Black Cards, switch to night mode </p>
                        :
                        <p className="text-l mt-3"> To mint one of 5000 available bbyDAO White Cards, switch to light mode  </p>
                    }
                </div>
                <div className="flex flex-col pt-16 md:w-1/2 bg-contain bg-no-repeat bg-right-top overflow-visible">
                    {
                        theme && theme === 'light' ? <img className="object-cover object-left-bottom" src="/mint/light_card.png" alt="lightcard" /> : <img className="object-cover object-left-bottom" src="/mint/night_card.png" alt="nightcard" />
                    }
                </div>
            </div>

            <div className="flex flex-row h-screen relative">
                <div className="flex flex-col pt-16 md:w-1/2 bg-contain bg-no-repeat bg-left-top overflow-visible">
                    <img className="object-cover object-right" src="/mint/network.png" alt="lightcard" />
                </div>

                <div className="flex flex-col justify-center items-start md:px-20 md:w-1/2">
                    <p className="text-6xl"> What Is It? </p>
                    <p className="text-l mt-3"> The bbyDAO Card Collection is a unique offering of platform ownership in the form on an NFT. When held in one of your bbyDAO wallet, UI/UX changes in app will reflect new funcitonality afforded to holders. </p>
                    {
                        theme && theme === 'light' ? 
                        <p className="text-l mt-3"> The bbyDAO White Card allows a user to interface with an in platform Nursery for White Card holders, as well as claim a share of rewards from the bbyDAO treasury. </p>
                        :
                        <p className="text-l mt-3"> the bbyDAO Black Card allows a user to interface with an in platform Nursery for Black Card holders, as well as claim a share of rewards form the bbyDAO treasury.  </p>
                    }
                </div>
            </div>

            <div className="flex flex-row h-screen relative">
                <div className="flex flex-col justify-center items-start md:px-20 md:w-1/2">
                    <p className="text-6xl"> Governance & Yield </p>
                    <p className="text-l mt-3"> 20% of platform fees are claimable by holders for both cards (10% White / 10% Black) </p> 
                </div>
                <div className="flex flex-col pt-16 md:w-1/2 overflow-visible">
                    {
                        theme && theme === 'light' ? <img className="object-cover object-left" src="/mint/card_content_light.png" alt="cardcontentlight" /> : <img className="object-cover object-left" src="/mint/card_content_night.png" alt="cardcontentnight" />
                    }
                </div>
            </div>    

            <div className="flex flex-row h-screen relative">
                <div className="flex flex-col pt-16 md:w-1/2 bg-contain bg-no-repeat bg-left-top overflow-visible">
                    {
                        theme && theme === 'light' ? <img className="object-cover object-right" src="/mint/bby_3d_layer_light.png" alt="lightcard" /> : <img className="object-cover object-right" src="/mint/bby_3d_layer_night.png" alt="nightcard" />
                    }
                </div>
                <div className="flex flex-col justify-center items-start md:px-20 md:w-1/2">
                    <p className="text-6xl"> Pricing </p>
                    {
                        theme && theme === 'light' ? 
                        <p className="text-xl mt-3 mb-3"> { Number(0.08 * count).toFixed(2) }E </p>
                        :
                        <p className="text-xl mt-3 mb-3"> { Number(0.8 * count).toFixed(1) }E </p>
                    }
                    <div className="flex flex-row">
                        <Counter />
                        <MintButton />
                    </div>
                </div>
            </div>
        </div>
            

    </main>
    )
}

export default Mint
import React, { useContext, useState } from "react"
import { useConnect, useAccount } from "wagmi"
import { useTheme } from "next-themes"
import { ethers, Contract, BigNumber } from "ethers"

const minimalABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "creatorMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "mint",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

const Mint = ({ children }) => {
  const { theme, setTheme } = useTheme()
  const [count, setCount] = useState(1)
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const handleMint = async () => {
    
    const CONTRACT_ADDRESS = theme === "dark" ? "" : "0x40c61FEFaC6D67869240106A8EB9dD252501B75e";

    try {
      if (data?.connected && accountData) {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, minimalABI, signer);
        const value = theme === "dark" ? "0.8" : "0.08"
    
        const tx = await connectedContract.mint({ value: ethers.utils.parseEther(value) })
        await tx.wait()
        console.log(`Mined, see transaction: https://etherscan.io/tx/${tx.hash}`);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* grid 1 */}
      <div className="flex flex-col items-center justify-center p-10">
        <div className="text-4xl md:text-6xl"> BbyDAO Card Collection </div>
        <div className="text-l mt-3">
        To mint one of { theme && theme === "dark" ? 5000 : 500 } available bbyDAO {theme && theme === "dark" ? "White" : "Black"} Cards, switch to 
        {theme && theme === "dark" ? " light" : " dark"} mode
        </div>
      </div>
      {/* grid 2 */}
      <div className="flex flex-col overflow-visible bg-contain bg-right-top bg-no-repeat p-10">
        <img src={`/mint/${theme && theme === "dark" ? "night_card" : "light_card"}.png`} alt="bbyDao Card" />
      </div>
      
      {/* grid 5 */}
      <div className="flex flex-col items-start justify-center p-10">
        <div className="text-5xl md:text-6xl">Governance & Yield </div>
        <p className="text-l mt-3">
          20% of platform fees are claimable by holders on an interval
        </p>
        <p className="text-l mt-3">
          Holders will receive generative bbyDAO PFPs
        </p>
        <a className="text-l mt-3 cursor-pointer" target="_blank" href="https://mirror.xyz/0x98B691df2794142AcdE5E732a00f785DAB55Dbae/K6LmUXixMkZ1X6HzrKxHn84le7KV3LUeoZmrdGZwuZ4">
          Read More
        </a>
      </div>
      <div className="flex flex-col p-10">
        <img
          src={`/mint/${theme && theme === "dark" ? "card_content_night" : "card_content_light"}.png`}
          alt="bbyDao 3D"
        />
      </div>
      {/* grid 6 */}
      <div className="flex flex-col p-10">
        <img
          src={`/mint/${theme && theme === "dark" ? "bby_3d_layer_night" : "bby_3d_layer_light"}.png`}
          alt="bbyDao 3D"
        />
      </div>
      {/* grid 7 */}
      <div className="flex flex-col items-start justify-center p-10">
        <p className="text-5xl md:text-6xl"> Pricing </p>
        <p className="mt-3 mb-3 text-xl">
          You are minting 1 bbyDAO {theme && theme === "dark" ? "Black" : "White"} Card for {Number(`${theme && theme === "dark" ? 0.8 : 0.08}` * count).toFixed(2)} E
        </p>
        <div className="flex flex-row">
        <div className="relative">
        <button
          className="mr-3 flex w-max transform flex-row rounded-full bg-gradient-to-r from-[#0DB2AC] via-[#FC8D4D] to-[#FABA32] p-0.5 shadow transition duration-500 ease-in-out hover:-translate-x-0.5 hover:bg-white hover:bg-gradient-to-l dark:hover:bg-slate-700"
          onClick={() => handleMint()}
        >
          <span className="block rounded-full bg-slate-200 px-6 py-[0.45rem] font-bold text-[#FC8D4D] hover:bg-opacity-50 hover:text-white dark:bg-slate-900 dark:hover:bg-opacity-75">
            mint!
          </span>
        </button>
      </div>
        </div>
      </div>
    </div>
  )
}

export default Mint

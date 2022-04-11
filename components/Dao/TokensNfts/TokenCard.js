import React from "react"
import { useAccount } from "wagmi"
import { FaEthereum } from "react-icons/fa"

const TokenCard = ({ token, img }) => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const { balance, fiatBalance } = token
  console.log('token ', token)

  return (
    <div className="w-full">
      <div className="flex flex-col rounded-lg bg-slate-100 p-1 shadow-inner dark:bg-slate-800">
        <div className="flex flex-row items-center justify-between rounded-lg bg-slate-300 p-2 shadow dark:bg-slate-900">
          <div className="flex flex-row">
          <div className="flex items-center justify-center mx-2 h-10 w-10 rounded-full border border-white bg-slate-200 dark:bg-slate-900">
              { token.token?.logoUri ? <img src={token.token.logoUri}/> : <FaEthereum />}
          </div>
            
            <span className="ml-4 flex w-28 flex-row justify-center items-center rounded bg-slate-100 p-1 text-[12px] dark:bg-slate-800">
              <span className="text-blue-500">{ (balance / (10 ** 18)).toFixed(3) } { token.token?.symbol ? token.token.symbol : "ETH" } <span className="text-green-500">${ Number(fiatBalance).toFixed(2) }</span></span>
              
            </span>

          </div>

          {/* tx confirmations */}
          <div className="flex flex-row">
           

            <span></span>

           
          </div>

          <div className="flex flex-row justify-end px-1">
          <button
            className="mr-1 w-16 rounded-lg bg-blue-400 p-1 text-xs shadow-sm hover:bg-blue-500"
            onClick={console.log('open list')}
          >
            send 
          </button>

          <button
            className="mr-1 w-16 rounded-lg bg-blue-400 p-1 text-xs shadow-sm hover:bg-blue-500"
            onClick={console.log('open list')}
          >
            swap
          </button>

          <button
            className="mr-1 w-16 rounded-lg bg-blue-400 p-1 text-xs shadow-sm hover:bg-blue-500"
            onClick={console.log('open list')}
          >
            LP 
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenCard

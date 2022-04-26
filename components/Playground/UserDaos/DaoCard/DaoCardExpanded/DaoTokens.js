import React from "react"
import { FaEthereum } from "react-icons/fa"
import * as api from "/query/gnosisQuery"
import { useQuery } from "react-query"

const DaoTokens = ({ safe }) => {
  const {
    data: daoTokensData,
    error: daoTokensErr,
    isLoading: daoTokensLoading,
  } = useQuery(["daoTokens", safe], () => api.daoBalance(safe), { staleTime: 200000, refetchOnWindowFocus: false })

  return (
    <div className="flex flex-col">
      <div className="text-xl">tokens</div>
      <div className="grid grid-cols-2 gap-2 py-2">
        {daoTokensData?.map((token, i) => (
          <div
            key={i}
            className="flex w-full flex-row space-x-2 items-center p-2 dark:bg-slate-700 bg-slate-100 rounded-xl"
          >
            <div className="flex justify-center items-center h-10 w-10 rounded-full border border-white overflow-clip">
              {token?.token?.logoUri ? <img src={token?.token?.logoUri} alt={i} /> : <FaEthereum size={30} />}
            </div>
            {/* <div>{token?.token?.symbol ? token?.token?.symbol : "ETH"}</div> */}
            <div className="flex flex-col p-1 dark:bg-slate-600 bg-slate-200 rounded-xl h-full text-xs">
              <span>
                {(token?.balance / 10 ** 18).toFixed(3)} {token.token?.symbol ? token.token.symbol : "ETH"}
              </span>
              <span className="dark:text-teal-400 text-teal-600">${Number(token?.fiatBalance).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DaoTokens

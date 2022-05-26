import React from "react"
import { useBalance } from "wagmi"
import { useDaoStore } from "../../../../stores/useDaoStore"

const DaoBalance = ({ safe }) => {
  const ethPriceUSD = useDaoStore(state => state.ethPriceUSD)
  const { data, error, loading, getBalance } = useBalance({
    addressOrName: safe,
  })

  const USDBalance = React.useMemo(() => {
    if (!!data) {
      const price = data.formatted * ethPriceUSD
      return `$${parseFloat(price.toFixed(2))}`
    }
  }, [data, ethPriceUSD])

  return (
    <div className="flex flex-row space-x-2 text-xl">
      {loading ? (
        <div className="flex h-7 w-full flex-row items-start justify-start">
          <div className="flex h-full w-44 animate-pulse rounded-xl bg-slate-300 dark:bg-slate-900"></div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex">
            <div className="px-2">{data?.formatted.substring(0, 8)}</div>
            <div>ETH</div>
          </div>
          {/*{USDBalance ? (*/}
          {/*  <div className="flex">*/}
          {/*    <div className="font-thin text-sm italic text-slate-400">{USDBalance}</div>*/}
          {/*  </div>*/}
          {/*) : null}*/}
        </div>
      )}
    </div>
  )
}

export default DaoBalance

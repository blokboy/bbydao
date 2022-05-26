import React, {useEffect} from "react"
import useForm            from "../../hooks/useForm"

const TokenSearch = ({ token, tokenList, handlePickToken }) => {
  const { state, setState, handleChange } = useForm()

  const tokenSymbols = React.useMemo(() => {
    return tokenList?.reduce((acc = [], cv) => {
      if (acc.filter(item => item.symbol === cv.symbol).length < 1) acc.push({ symbol: cv.symbol, uri: cv.logoURI })

      return acc
    }, [])
  }, [tokenList])

  const filteredTokensBySymbol = React.useMemo(() => {
    return tokenSymbols.reduce((acc = [], cv) => {
      if (cv?.symbol?.toUpperCase().includes(state?.symbol?.toUpperCase()) && cv.symbol !== token?.symbol) {
        acc.push(cv)
      }

      return acc
    }, [])
  }, [state.symbol])

  useEffect(() => {
    setState({symbol: ''})
  }, [])

  return (
    <>
      <input
        id="symbol"
        name="symbol"
        onChange={handleChange}
        value={state?.symbol || ""}
        className="mt-8 h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-3xl leading-tight focus:outline-none dark:bg-slate-800"
        placeholder={"Type to search"}
        autoComplete="off"
        autoFocus={true}
      />
      {filteredTokensBySymbol && filteredTokensBySymbol?.length > 0 && (
        <div className="mt-4 flex max-h-96 flex-wrap gap-1 overflow-y-scroll rounded-lg bg-slate-100 p-4 pt-4 shadow-xl dark:bg-slate-800">
          {filteredTokensBySymbol.map((token, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePickToken(token)}
              className="mb-2 inline-flex self-start rounded-full bg-slate-300 p-2 px-4 font-light dark:bg-slate-600 hover:dark:bg-slate-700"
            >
              <div className="flex items-center justify-center">
                <div className="mr-2">{token?.symbol?.toUpperCase()}</div>
                <div className="flex h-6 w-6 overflow-hidden rounded-full">
                  <img src={token?.uri} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default TokenSearch

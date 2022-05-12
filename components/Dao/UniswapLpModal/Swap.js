import { ChainId, Token }          from "@uniswap/sdk"
import defaultTokens               from "@uniswap/default-token-list"
import React                       from "react"
import useForm                     from "hooks/useForm"
import { HiOutlineSwitchVertical } from "react-icons/hi"
import { flatten }                 from "utils/helpers"
import TokenInput                  from './TokenInput'
const Swap = ({ token }) => {
  const { state, handleChange } = useForm()
  const defaultTokenList = defaultTokens?.["tokens"]
  const isEth = React.useMemo(() => {
    if (parseInt(token?.ethValue) === 1 && token?.token === null && token?.tokenAddress === null) {
      return {
        ...token,
        token: {
          decimals: 18,
          logoUri: "https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png",
          name: "Ether",
          symbol: "ETH",
        },
        tokenAddress: "0x0", // eh
      }
    }
    return token
  }, [token])
  const [tokens, setTokens] = React.useState({
    token0: flatten(isEth),
    token1: null,
  })

  const tokenNames = React.useMemo(() => {
    return defaultTokenList?.reduce((acc = [], cv) => {
      acc.push(cv.symbol)
      return acc
    }, [])
  }, [defaultTokenList])

  const tokensBySymbol = React.useMemo(() => {
    return tokenNames.reduce((acc = [], cv) => {
      if (cv?.toUpperCase().includes(state?.symbol?.toUpperCase()) && !acc?.includes(cv?.toUpperCase())) {
        acc.push(cv?.toUpperCase())
      }

      return acc
    }, [])
  }, [state.symbol])

  const handlePickToken = React.useCallback(picked => {
    const index = defaultTokenList.findIndex(token => token.symbol === picked)
    setTokens({ ...tokens, token1: defaultTokenList[index] })
  }, [tokens])

  const switchTokenPlacement = React.useCallback(() => {
    setTokens({ token0: tokens.token1, token1: tokens.token0 })
  }, [tokens])

  return (
    <div>
      <form>
        <div>{console.log("tokens", tokens)}</div>
        {tokens?.token0 && (
          <div>
            <div> {tokens.token0?.symbol}</div>

          </div>
        )}
        {tokens?.token0 && tokens?.token1 && (
          <button type="button" onClick={() => switchTokenPlacement()}>
            <HiOutlineSwitchVertical size={20} />
          </button>
        )}
        {tokens?.token1 && (
          <div>
            <div>{tokens.token1?.symbol}</div>
          </div>
        )}
        <input
          id="symbol"
          name="symbol"
          onChange={handleChange}
          value={state?.symbol || ""}
          className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-3xl leading-tight focus:outline-none dark:bg-slate-800"
          placeholder={"Type to search"}
        />
        <div>
          {tokensBySymbol && tokensBySymbol?.length > 0 && (
            <div className="flex max-h-96 flex-col overflow-y-scroll pt-4">
              {tokensBySymbol.map(token => (
                <button
                  key={token}
                  type="button"
                  onClick={() => handlePickToken(token)}
                  className="mb-2 inline-flex self-start rounded-full bg-slate-300 p-2 font-light dark:bg-slate-600 hover:dark:bg-slate-700"
                >
                  {token?.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default Swap

import { BigNumber, ethers } from "ethers"
import React from "react"
import { flatten } from "utils/helpers"
import { useDaoStore } from "stores/useDaoStore"

const TokenInput = ({
  pair,
  token,
  tokenInputRef,
  handleSetTokenValue,
  handleSetMaxTokenValue,
  state,
  logo,
  setOpenSearch = () => {},
  tokens,
  isSwap,
  isSend,
  isEarn,
}) => {
  const uniswapV2GraphClient = useDaoStore(state => state.uniswapV2GraphClient)
  const setTokenInputPriceUSD = useDaoStore(state => state.setTokenInputPriceUSD)
  const tokenInputPricesUSD = useDaoStore(state => state.tokenInputPriceUSD)

  const ethPriceUSD = useDaoStore(state => state.ethPriceUSD)
  const [tokenPriceUSD, setTokenPriceUSD] = React.useState(null)

  const _token = React.useMemo(() => {
    if (!!token) {
      return flatten(token)
    }
  }, [token])

  const isToken0 = React.useMemo(() => {
    if (tokens?.token0) {
      return tokens?.token0?.symbol === _token?.symbol
    }
  }, [_token, tokens])

  const bbyDaoHasLessOf = React.useMemo(() => {
    if (
      !tokens?.token0 ||
      !tokens?.token1 ||
      (parseFloat(tokens?.token0?.fiatBalance) === 0 && parseFloat(tokens?.token1?.fiatBalance) === 0)
    ) {
      return undefined
    }

    if (parseFloat(tokens?.token0?.fiatBalance) < parseFloat(tokens?.token1?.fiatBalance)) {
      return flatten(tokens?.token0)?.symbol
    } else {
      return flatten(tokens?.token1)?.symbol
    }
  }, [tokens])

  const isTokenWithLessValue = React.useMemo(() => {
    if (bbyDaoHasLessOf) {
      return bbyDaoHasLessOf === _token?.symbol
    }
  }, [bbyDaoHasLessOf])

  const showMax = React.useMemo(() => {
    if (isSwap) {
      return isToken0 && parseFloat(_token?.fiatBalance) > 0 && tokens.token0 && tokens.token1
    }

    if (isSend || isEarn) {
      return true
    }

    return isTokenWithLessValue
  }, [isSwap, isToken0, isTokenWithLessValue, _token, tokens])

  const max = React.useMemo(() => {
    if (!!_token) {
      /*
      even though we are using signers wallet for ETH, gnosis is still approximating the costs as if
      the gas would be coming from the bbydao -- this is why we get err Error: Not enough Ether funds,
      if we don't account for gas
      */
      if (_token.symbol === "ETH") {
        const max = ethers.utils.formatUnits(BigNumber.from(_token?.balance), _token?.decimals)
        const uniFee = parseFloat(max) * 0.01 * 0.3
        const gasForSwap = 0.0099 // should use API for this value -- i.e for LP ETH this value is likely too small
        return (parseFloat(max) - uniFee - gasForSwap).toFixed(6).toString()
      }

      return ethers.utils.formatUnits(BigNumber.from(_token?.balance), _token?.decimals)
    }
  }, [_token])


  /* Get USD price of token */
  React.useMemo(async () => {
    if (!!token && isSwap) {
      let priceUSD
      if (token.symbol !== "ETH") {
        const address = ethers.utils.getAddress(token?.address).toLowerCase()
        const data = await uniswapV2GraphClient
          .query(`{token(id: "${address}"){name symbol decimals derivedETH}}`)
          .toPromise()
        const derivedETH = data?.data?.token?.derivedETH
        priceUSD = (derivedETH * ethPriceUSD)
        setTokenPriceUSD(priceUSD)
      }
    }
  }, [token, tokens, uniswapV2GraphClient, ethPriceUSD, state])

  /*  store USD prices of tokens and their input to zustand */
  React.useMemo(async () => {
    if (!!ethPriceUSD) {
      if (tokens?.token0?.symbol === token?.symbol) {
        setTokenInputPriceUSD({
          ...tokenInputPricesUSD,
          ...{ token0: (token?.symbol === "ETH" ? ethPriceUSD : tokenPriceUSD) * state?.[_token?.symbol] },
        })
      } else {
        setTokenInputPriceUSD({
          ...tokenInputPricesUSD,
          ...{ token1: (token?.symbol === "ETH" ? ethPriceUSD : tokenPriceUSD) * state?.[_token?.symbol] },
        })
      }
    }
  }, [state, tokenPriceUSD])

  /*  Compose percentage display of USD price diff of trade */

  const USDDiff = React.useMemo(() => {
    if (!!tokenInputPricesUSD.token0 && !!tokenInputPricesUSD.token1) {
      const diff =
        (tokenInputPricesUSD.token1 - tokenInputPricesUSD.token0) /
        ((tokenInputPricesUSD.token1 + tokenInputPricesUSD.token0) / 2)
      return `(${(diff * 100).toFixed(2)}%)`
    }
  }, [tokenInputPricesUSD])

  return (
    <div className="flex w-full flex-col rounded-xl border bg-slate-100 p-4 hover:border-[#FC8D4D] dark:bg-slate-800">
      <div className="flex flex-row">
        <input
          value={state?.[_token?.symbol] || ""}
          onChange={e => handleSetTokenValue(e, _token, tokenInputRef)}
          className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-4xl leading-tight focus:outline-none dark:bg-slate-800"
          id="name"
          name={_token?.symbol}
          type="number"
          step={0.00001}
          placeholder="0.0"
          required
          max={max || ""}
          ref={tokenInputRef}
          disabled={!isSend && !isEarn && (!pair || !tokens?.token0 || !tokens?.token1)}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={!isToken0 || !_token ? () => setOpenSearch(true) : () => {}}
          className="text-l my-3 flex items-center justify-center rounded-xl bg-slate-200 py-1 px-6 shadow-xl dark:bg-slate-700"
        >
          {(_token && (
            <>
              {logo && (
                <div className="mr-2 flex  h-6 w-6 overflow-hidden rounded-full">
                  <img alt={`${_token?.symbol} icon`} src={logo} />
                </div>
              )}
            </>
          )) || <div className="flex h-8 w-8 min-w-fit items-center">Select</div>}
          {_token?.symbol ? _token?.symbol : ""}
        </button>
      </div>
      <div className="flex w-full flex-row items-end justify-end space-x-2 font-light">
        <div className="flex w-full justify-between">
          {(isSwap && !!state?.[_token?.symbol] && (!isNaN(tokenInputPricesUSD.token0) && !isNaN(tokenInputPricesUSD.token1))) ? (
            <div className="flex">
              <div className="text-sm text-slate-600">$</div>
              <div className="text-sm text-slate-600">
                {((token?.symbol === "ETH" ? ethPriceUSD : tokenPriceUSD) * state?.[_token?.symbol]).toFixed(2)}{" "}
                {!isToken0 && (
                  <span className={`${USDDiff?.includes("-") ? "text-slate-600" : "text-violet-300"}`}>{USDDiff}</span>
                )}
              </div>
            </div>
          ) : null}

          {!!_token?.balance ? (
            <div className="ml-auto flex items-center">
              <div className="text-sm flex text-slate-600 italic text-xs">Balance:</div>
              <div className="text-sm flex text-slate-600 ml-1">
                {ethers.utils.formatUnits(_token?.balance, _token?.decimals).match(/^\d+(?:\.\d{0,5})?/)}
              </div>
            </div>
          ) : null}
        </div>

        {showMax && (
          <div
            className={`flex cursor-pointer justify-end rounded-lg bg-[#eda67e24] py-0.5 px-2 text-[.8rem] text-[#FC8D4D] hover:bg-[#f98c4e57] ${
              !pair && !isSend && !isEarn ? "pointer-events-none" : ""
            }`}
            onClick={!!pair || isSend || isEarn ? () => handleSetMaxTokenValue(_token, tokenInputRef) : () => {}}
          >
            MAX
          </div>
        )}
      </div>
    </div>
  )
}

export default TokenInput

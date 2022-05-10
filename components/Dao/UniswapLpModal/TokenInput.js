const TokenInput = ({
  pair,
  lpToken,
  token1InputRef,
  handleSetTokenValue,
  handleSetMaxTokenValue,
  readableTokenBalance,
  state,
  logo,
}) => (
  <div className="flex w-full flex-col rounded-xl border bg-slate-100 p-4 hover:border-[#FC8D4D] dark:bg-slate-800">
    <div className="flex flex-row">
      <input
        value={state?.[lpToken.token.symbol] || (readableTokenBalance(lpToken) < 0.1 ? 0 : "")}
        onChange={e => handleSetTokenValue(e, lpToken, token1InputRef)}
        className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-4xl leading-tight focus:outline-none dark:bg-slate-800"
        id="name"
        name={lpToken?.token?.symbol}
        type="number"
        step={0.000001}
        placeholder="0.0"
        required
        max={lpToken?.balance / 10 ** lpToken?.token?.decimals}
        ref={token1InputRef}
        disabled={!pair || parseInt(lpToken?.fiatBalance) === 0}
      />
      <div className="text-l my-3 flex items-center justify-center rounded-xl bg-slate-200 py-1 px-6 shadow-xl dark:bg-slate-700">
        <img src={logo} className="mr-2 h-8 w-8 min-w-fit rounded-full" />
        {lpToken?.token?.symbol ? lpToken?.token?.symbol : ""}
      </div>
    </div>
    <div className="flex w-full flex-row items-end justify-end space-x-2 font-light">
      <div className="text-sm text-slate-600">Balance:</div>
      <div className="text-sm text-slate-600">{readableTokenBalance(lpToken)}</div>
      <div
        className={`flex cursor-pointer justify-end rounded-lg bg-[#eda67e24] py-0.5 px-2 text-[.8rem] text-[#FC8D4D] hover:bg-[#f98c4e57] ${
          !pair ? "pointer-events-none" : ""
        }`}
        onClick={() => (!pair || parseInt(lpToken?.fiatBalance) === 0) ? null : handleSetMaxTokenValue(lpToken, token1InputRef)}
      >
        MAX
      </div>
    </div>
  </div>
)

export default TokenInput

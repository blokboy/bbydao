const TokenInput = ({
                        pair,
                        lpToken,
                        token1InputRef,
                        handleSetTokenValue,
                        handleSetMaxTokenValue,
                        readableTokenBalance,
                        state,
                        logo
                    }) =>
    <div className="flex w-full flex-col p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border hover:border-[#FC8D4D]">
        <div className="flex flex-row">
            <input
                value={state?.[lpToken.token.symbol] || (readableTokenBalance(lpToken) < .1 ? 0 : '')}
                onChange={(e) => handleSetTokenValue(e, lpToken, token1InputRef)}
                className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-4xl leading-tight focus:outline-none dark:bg-slate-800"
                id="name"
                name={lpToken?.token?.symbol}
                type="number"
                step={0.000001}
                placeholder="0.0"
                required
              //  min="0"
                max={lpToken?.balance / 10 ** lpToken?.token?.decimals}
                ref={token1InputRef}
                disabled={!pair}
            />
            {/* Button to select token  */}
            <div
                className="flex justify-center items-center my-3 rounded-xl bg-slate-200 py-1 px-6 text-l shadow-xl dark:bg-slate-700">
                <img src={logo} className="min-w-fit mr-2 h-8 w-8 rounded-full" />
                {lpToken?.token?.symbol ? lpToken?.token?.symbol : ""}
            </div>
        </div>
        <div className="flex items-end w-full flex-row justify-end space-x-2 font-light">
            <div className="text-sm text-slate-600">Balance:</div>
            <div className="text-sm text-slate-600">{readableTokenBalance(lpToken)}</div>
            <div
                className={`flex justify-end py-0.5 px-2 rounded-lg cursor-pointer text-[.8rem] text-[#FC8D4D] bg-[#eda67e24] hover:bg-[#f98c4e57] ${!pair ? 'pointer-events-none' : ''}`}
                onClick={() => handleSetMaxTokenValue(lpToken, token1InputRef)}
            >
                MAX
            </div>
        </div>
    </div>

export default TokenInput

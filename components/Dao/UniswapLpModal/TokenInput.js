const TokenInput = ({
                        pair,
                        lpToken,
                        token1InputRef,
                        handleSetTokenValue,
                        handleSetMaxTokenValue,
                        readableTokenBalance,
                        state
                    }) =>
    <div className="flex w-full flex-col rounded-xl bg-slate-100 dark:bg-slate-800">
        <div className="flex flex-row">
            <input
                value={state?.[lpToken.token.symbol] || (readableTokenBalance(lpToken) < .1 ? 0 : '')}
                onChange={(e) => handleSetTokenValue(e, lpToken, token1InputRef)}
                className="h-16 w-full appearance-none rounded-lg bg-slate-100 py-2 px-3 text-xl leading-tight focus:outline-none dark:bg-slate-800"
                id="name"
                name={lpToken?.token?.symbol}
                type="number"
                step={0.000001}
                placeholder="0.0"
                required
                max={lpToken?.balance / 10 ** lpToken?.token?.decimals}
                ref={token1InputRef}
                disabled={!pair}
            />
            {/* Button to select token  */}
            <div className="m-2 w-2/12 rounded-xl bg-slate-200 p-2 text-center text-xl dark:bg-slate-700">
                {lpToken?.token?.symbol ? lpToken?.token?.symbol : ""}
            </div>
        </div>
        <div className="flex w-full flex-row justify-end space-x-2 px-2">
            <div>balance:</div>
            <div>{readableTokenBalance(lpToken)}</div>
        </div>
        <div
            className={`mr-3 flex cursor-pointer justify-end text-[#FC8D4D] ${!pair ? 'pointer-events-none' : ''}`}
            onClick={() => handleSetMaxTokenValue(lpToken, token1InputRef)}
        >
            max
        </div>
    </div>

export default TokenInput

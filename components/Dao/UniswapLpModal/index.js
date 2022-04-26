import {calculateSafeTransactionHash} from '@gnosis.pm/safe-contracts'
import GnosisSafeSol                  from '@gnosis.pm/safe-contracts/build/artifacts/contracts/GnosisSafe.sol/GnosisSafe.json'
import SafeServiceClient              from '@gnosis.pm/safe-service-client'

import {ChainId, Fetcher, Route, Token, TokenAmount}             from "@uniswap/sdk"
import IUniswapV2ERC20                                           from "@uniswap/v2-core/build/IUniswapV2ERC20.json";
import IUniswapV2Router02
                                                                 from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";
import Modal                                                     from "components/Layout/Modal"
import CPK, {EthersAdapter}                                      from 'contract-proxy-kit'
import {BigNumber, ethers}                                       from 'ethers'
import {formatUnits}                                             from 'ethers/lib/utils'
import useForm                                                   from "hooks/useForm"
import {useRouter}                                               from 'next/router'
import React, {useEffect, useMemo, useRef, useState}             from "react"
import {useDaoStore}                                             from "stores/useDaoStore"
import {useSigner}                                                from 'wagmi'
import {calculateSafeTxHash, getEIP712Signature, saveTxToHistory} from './helpers'
import PoolInfo                                                   from './PoolInfo'
import TokenInput                                                from './TokenInput'


const UniswapLpModal = ({safeAddress, tokenLogos}) => {
    const UniswapV2Router02 = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
    const [{data: signer}] = useSigner()
    const setUniswapLpModalOpen = useDaoStore(state => state.setUniswapLpModalOpen)
    const lpToken0 = useDaoStore(state => state.lpToken0)
    const lpToken1 = useDaoStore(state => state.lpToken1)
    const setLpToken1 = useDaoStore(state => state.setLpToken1)
    const setLpToken0 = useDaoStore(state => state.setLpToken0)
    const {state, setState, handleChange} = useForm()
    const token0InputRef = useRef()
    const token1InputRef = useRef()
    const [pair, setPair] = useState()
    const [liquidityInfo, setLiquidityInfo] = useState({})
    const [maxError, setMaxError] = useState("")
    const [hasAllowance, setHasAllowance] = useState()
    const token0Logo = tokenLogos.filter(logo => logo.symbol === lpToken0.token.symbol)[0].uri
    const token1Logo = tokenLogos.filter(logo => logo.symbol === lpToken1.token.symbol)[0].uri
    const supplyDisabled = !signer || maxError.length > 0 || !hasAllowance?.token0 || !hasAllowance?.token1


    const router = useRouter()
    const {address} = router.query
    const currentBbyDao = address

    const safeService = new SafeServiceClient(
        "https://safe-transaction.gnosis.io"
    )

    const createGnosisTransaction = async ({data, contract}) => {
        if (!!signer) {

            /*  Initialize Gnosis CPK - set in state */
            const ethLibAdapter = new EthersAdapter({ethers, signer})
            const cpk = await CPK.create({ethLibAdapter, ownerAccount: safeAddress})

            /*  Initialize bbyDao Gnosis Safe Instance */
            const safes = await safeService.getSafesByOwner(signer._address)
            const bbyDaoSafe = await safes?.safes.filter(safe => safe === currentBbyDao)[0]
            const bbyDaoSafeInstance = new ethers.Contract(bbyDaoSafe, GnosisSafeSol.abi, signer)

            /* last transaction made by bbyDAO */
            const transactions = await safeService.getAllTransactions(bbyDaoSafe)
            const nonce = await safeService.getNextNonce(bbyDaoSafe)
            console.log('transactions', nonce)

            /* Pre-validated Gnosis signature */
            // https://docs.gnosis-safe.io/contracts/signatures
            const EMPTY_DATA = '0x'
            const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
            const SIGNATURE_TYPE = '01'
            const CALL = 0
            const getPreValidatedSignature = (from, initialString = EMPTY_DATA) => {
                return `${initialString}000000000000000000000000${from.replace(
                    EMPTY_DATA,
                    '',
                )}0000000000000000000000000000000000000000000000000000000000000000${SIGNATURE_TYPE}`
            }
            const signature = getPreValidatedSignature(signer._address)

            /* Encode uniswap addLiquidity function with input data  */
            const uniFragments = contract.interface.functions
            let uniRouterV2 = new ethers.utils.Interface(IUniswapV2Router02.abi)
            const addLiquidityFnData = uniRouterV2.encodeFunctionData(
                uniFragments['addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)'],
                [data.tokenA, data.tokenB, data.amountADesired, data.amountBDesired,
                    data.amountAMin, data.amountBMin, data.addressTo, data.deadline]
            )

            /*  construct gnosis transaction object  */
            let txHash
            const safeTx = {
                safeInstance: bbyDaoSafeInstance,
                to: pair?.liquidityToken?.address,
                valueInWei: (liquidityInfo?.transactionInfo?.[0]?.amountInWei.add(liquidityInfo?.transactionInfo?.[1]?.amountInWei))?._hex,
                data: addLiquidityFnData,
                operation: CALL,
                nonce: nonce,
                safeTxGas: 0,
                baseGas: 0,
                gasPrice: 0,
                gasToken: ZERO_ADDRESS,
                refundReceiver: ZERO_ADDRESS,
                sender: signer._address,
                sigs: signature,
            }


            /*  generate transaction hash  */
            const safeTxHash = calculateSafeTxHash(safeAddress, {...safeTx, value: safeTx.valueInWei})

            console.log('HASH', calculateSafeTransactionHash(bbyDaoSafeInstance, {
                to: pair?.liquidityToken?.address,
                value: BigNumber.from((liquidityInfo?.transactionInfo?.[0]?.amountInWei.add(liquidityInfo?.transactionInfo?.[1]?.amountInWei))?._hex),
                data: addLiquidityFnData,
                operation: CALL,
                safeTxGas: 0,
                baseGas: 0,
                gasPrice: 0,
                gasToken: ZERO_ADDRESS,
                refundReceiver: ZERO_ADDRESS,
                nonce: transactions.count + 1
            }, signer.provider._network.chainId))







            if (!!safeTx.data && !!safeTx.valueInWei) {
                const threshold = await bbyDaoSafeInstance?.getThreshold()
                console.log('sig', signature)
                console.log('safeTx', safeTx)

                if (threshold.toNumber() > 1) {
                    /*  Reject or ask for approvals */

                } else {
                    if (!!safeTxHash) {

                        try {
                            const signature = await getEIP712Signature(safeTx, safeAddress, signer, bbyDaoSafeInstance)

                            console.log('signature', signature)
                            if (signature) {
                                const tx = await saveTxToHistory({...safeTx, safeTxHash, signature})
                                //
                                if (tx === 201) {
                                   // const execute = bbyDaoSafeInstance?.executeTransaction({...safeTx})
                                    console.log('created')
                                }
                                console.log('tx', tx)
                            }
                        } catch (err) {
                            console.error(`Error while creating transaction: ${err}`)
                            throw err
                        }
                    }
                }
            }
        }
    }


    // Close function provided to <Modal /> component
    const closeUniswapLpModal = e => {
        setLpToken0({})
        setLpToken1({})
        setUniswapLpModalOpen()
        setMaxError("")
    }

    const amount = (amount, decimals) =>
        Math.round(amount * (10 ** decimals)).toString()

    const handleSubmit = async (e, liquidityInfo) => {
        e.preventDefault()

        const contract = new ethers.Contract(UniswapV2Router02, IUniswapV2Router02.abi, signer)
        const pairHasEth = liquidityInfo.transactionInfo.filter(token => token.token.symbol === 'ETH')
        const slippage = .01 // default 1% slippage

        /* token A */
        const tokenA = liquidityInfo.transactionInfo[0].token.address
        const tokenADecimals = liquidityInfo.transactionInfo[0].token.decimals
        const tokenAAmount = liquidityInfo.transactionInfo[0].amount
        const amountADesired = amount(tokenAAmount, tokenADecimals) // wondering if this is correct
        const amountAMin = amount(tokenAAmount - tokenAAmount * slippage, tokenADecimals)

        /* token B */
        const tokenB = liquidityInfo.transactionInfo[1].token.address
        const tokenBDecimals = liquidityInfo.transactionInfo[1].token.decimals
        const tokenBAmount = liquidityInfo.transactionInfo[1].amount
        const amountBDesired = amount(tokenBAmount, tokenBDecimals)
        const amountBMin = amount(tokenBAmount - tokenBAmount * slippage, tokenBDecimals)

        const addressTo = safeAddress
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20


        if (pairHasEth.length === 0) {
            createGnosisTransaction(
                {
                    data: {
                        tokenA,
                        tokenB,
                        amountADesired,
                        amountBDesired,
                        amountAMin,
                        amountBMin,
                        addressTo,
                        deadline
                    },
                    contract
                }
            )
        } else {
            //     function addLiquidityETH(
            //         address token,
            //         uint amountTokenDesired,
            //         uint amountTokenMin,
            //         uint amountETHMin,
            //         address to,
            //         uint deadline
            // ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
        }
        // https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#addliquidity
    }


    /* Get Total Supply of LP pair on-chain  */
    const totalPairSupply = async (pair) => {
        /* create a generic provider and query for unsold market items */
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(pair.liquidityToken.address, IUniswapV2ERC20.abi, provider)
        return await contract.totalSupply()
    }
    /* Human Readable Token Balance  */
    const readableTokenBalance = (token) => {
        return Number((token?.balance / 10 ** token?.token?.decimals).toString().match(/^\d+(?:\.\d{0,3})?/))
    }

    /*  Construct object of selected tokens represented as Uniswap Token Objects */
    const uniswapTokens = useMemo(() => {
        const token0 = new Token(
            ChainId.MAINNET,
            lpToken0?.tokenAddress,
            lpToken0?.token?.decimals,
            lpToken0?.token?.symbol,
            lpToken0?.token?.name
        )

        const token1 = new Token(
            ChainId.MAINNET,
            lpToken1?.tokenAddress,
            lpToken1?.token?.decimals,
            lpToken1?.token?.symbol,
            lpToken1?.token?.name
        )

        return {[lpToken0?.token?.symbol]: token0, [lpToken1?.token?.symbol]: token1}

    }, [lpToken0, lpToken1])


    /* Handle setting token values and retrieving liquidity pair information  */
    const handleSetTokenValue = async (e, token, tokenRef) => {
        const bal = token?.balance
        const dec = token?.token?.decimals
        const max = bal / 10 ** dec
        const token0 = Object.entries(uniswapTokens).filter(item => item[0] === token.token.symbol)[0][1]
        const token0Input = e?.target?.valueAsNumber
        const route = new Route([pair], uniswapTokens[token.token.symbol])
        const midPrice = route.midPrice.toSignificant(6)
        const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token.token.symbol)[0][1]
        const token1Input = Number((token0Input * midPrice))
        const pairToken = lpToken0.token.symbol === token.token.symbol ? lpToken1 : lpToken0

        /*  If User attempts to LP more than balance, default to max balance */
        if (token0Input > max) {
            handleSetMaxTokenValue(token, tokenRef)
        } else {
            setState(state => ({...state, [token.token.symbol]: token0Input}))
            setState(state => ({...state, [token1?.symbol]: token1Input}))
            setMaxError("")

            if (!isNaN(token0Input) && !isNaN(token1Input) && token0Input > 0 && token1Input > 0) {
                const liquidityInfo = await getLiquidityPairInfo({
                    pair: pair,
                    token0: token0,
                    token0Input: token0Input,
                    token0ETHConversion: token.ethValue,
                    token1: token1,
                    token1Input: token1Input,
                    token1ETHConversion: pairToken.ethValue,
                })
                setLiquidityInfo(liquidityInfo)
            }
        }
    }
    /* Handle setting max token values and retrieving liquidity pair information  */
    const handleSetMaxTokenValue = async (token, tokenRef) => {
        const token0 = uniswapTokens[token.token.symbol]
        const token0Input = tokenRef?.current?.max
        const pairToken = lpToken0.token.symbol === token.token.symbol ? lpToken1 : lpToken0

        const route = new Route([pair], uniswapTokens[token.token.symbol])
        const midPrice = route.midPrice.toSignificant(6)
        const invertMidPrice = route.midPrice.invert().toSignificant(6)
        const token1 = Object.entries(uniswapTokens).filter(item => item[0] !== token.token.symbol)[0][1]
        const token1Input = token0Input * midPrice


        if (token?.fiatBalance > pairToken?.fiatBalance) {
            setMaxError(`Insufficient ${pairToken?.token?.symbol} balance`)
            setState(state => ({...state, [token.token.symbol]: 0}))
            setState(state => ({...state, [token1.symbol]: 0}))
            setLiquidityInfo({})
        } else {
            setState(state => ({...state, [token.token.symbol]: token0Input}))
            setState(state => ({...state, [token1.symbol]: token1Input}))
            setMaxError("")

            const liquidityInfo = await getLiquidityPairInfo({
                pair: pair,
                token0: token0,
                token0Input: token0Input,
                token0ETHConversion: token.ethValue,
                token1: token1,
                token1Input: token1Input,
                token1ETHConversion: pairToken.ethValue,
            })
            setLiquidityInfo(liquidityInfo)
        }
    }
    /* Handle interaction with Uniswap to get LP information  */
    const getLiquidityPairInfo = async ({
                                            pair,
                                            token0,
                                            token0Input,
                                            token0ETHConversion,
                                            token1,
                                            token1Input,
                                            token1ETHConversion
                                        }) => {
        if (!!pair) {
            const total = await totalPairSupply(pair)
            const totalTokenAmount = await new TokenAmount(pair.liquidityToken, total)
            const token0Amount = await new TokenAmount(token0, amount(token0Input, token0?.decimals))
            const token0AmountInEth = (token0Input * token0ETHConversion).toFixed(token0?.decimals).toString()
            const token1Amount = await new TokenAmount(token1, amount(token1Input, token1?.decimals))
            const token1AmountInEth = (token1Input * token1ETHConversion).toFixed(token1?.decimals).toString()
            const uniswapTokensMinted = pair?.getLiquidityMinted(totalTokenAmount, token0Amount, token1Amount).toFixed(pair.liquidityToken.decimals)
            const percentageOfPool = uniswapTokensMinted / totalTokenAmount.toFixed(pair.liquidityToken.decimals)
            const uniswapPairURI = `https://v2.info.uniswap.org/pair/${pair.liquidityToken.address}`
            const etherscanURI = `https://etherscan.io/address/${pair.liquidityToken.address}`

            const transactionInfo = [
                {
                    token: token0,
                    amount: Number(token0Input),
                    amountInWei: ethers.utils.parseEther(token0AmountInEth)
                },
                {
                    token: token1,
                    amount: Number(token1Input),
                    amountInWei: ethers.utils.parseEther(token1AmountInEth)
                }
            ]

            return {
                percentageOfPool,
                total: formatUnits(BigNumber.from(total._hex)),
                transactionInfo,
                uniswapTokensMinted,
                uris: {
                    uniswap: uniswapPairURI,
                    etherscan: etherscanURI
                }
            }
        }
    }

    /* Initialize state of inputs and initialize Uniswap Pair */
    const init = async () => {
        setState(state => ({...state, [lpToken0.token.symbol]: 0}))
        setState(state => ({...state, [lpToken1.token.symbol]: 0}))
        const uniPair = await Fetcher.fetchPairData(uniswapTokens[lpToken0.token.symbol], uniswapTokens[lpToken1.token.symbol])
        await setPair(uniPair)
    }
    useEffect(() => {
        init()

    }, [])

    return (
        <Modal close={closeUniswapLpModal} heading={"Add Liquidity"}>
            <div className="p-4 mt-2 rounded-xl bg-[#eda67e24] text-[#FC8D4D] font-thin">
                <span className="font-bold">Tip:</span> When you add liquidity, you will receive pool tokens
                representing your position.
                These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any
                time.
            </div>
            <form
                className="flex w-full flex-col space-y-8 py-4"
                onSubmit={(e) => handleSubmit(e, liquidityInfo)}
            >
                <TokenInput
                    pair={pair}
                    token1InputRef={token0InputRef}
                    lpToken={lpToken0}
                    handleSetTokenValue={handleSetTokenValue}
                    handleSetMaxTokenValue={handleSetMaxTokenValue}
                    readableTokenBalance={readableTokenBalance}
                    state={state}
                    logo={token0Logo}
                />
                <TokenInput
                    pair={pair}
                    token1InputRef={token1InputRef}
                    lpToken={lpToken1}
                    handleSetTokenValue={handleSetTokenValue}
                    handleSetMaxTokenValue={handleSetMaxTokenValue}
                    readableTokenBalance={readableTokenBalance}
                    state={state}
                    logo={token1Logo}
                />
                <div className="mb-8 w-full">
                    {liquidityInfo && (
                        <PoolInfo
                            spender={pair?.liquidityToken?.address}
                            info={liquidityInfo}
                            signer={signer}
                            hasAllowance={hasAllowance}
                            setHasAllowance={setHasAllowance}
                        />
                    )}
                    {(state[lpToken0?.token?.symbol] > 0 && state[lpToken1?.token?.symbol] > 0) && (
                        <button
                            className={`h-16 w-full appearance-none rounded-full border ${supplyDisabled ? 'bg-slate-200' : 'bg-[#FC8D4D] dark:hover:bg-[#10172a]'} mt-4 py-2 px-3 text-xl leading-tight focus:outline-none focus:shadow-outline border ${supplyDisabled ? 'border-slate-300' : 'dark:border-[#10172a] border-[#e1793d] hover:bg-[#e1793d]'} dark:bg-slate-800`}
                            type="submit"
                            disabled={supplyDisabled}
                        >
                            <div
                                className={`${supplyDisabled ? 'text-[#b9b9b9]' : 'text-white'}`}>{maxError.length > 0 ? maxError : supplyDisabled ? 'Token Approval Needed' : 'Supply'}</div>
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    )
}

export default UniswapLpModal

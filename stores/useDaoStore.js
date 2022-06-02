import create from "zustand"

export const useDaoStore = create(set => ({
  // transaction modal display
  txModalOpen: false,
  setTxModalOpen: () => set(state => ({ txModalOpen: !state.txModalOpen })),

  ethPriceUSD: null,
  setETHPriceUSD: price => set({ethPriceUSD: price}),

  uniswapV2GraphClient: null,
  setUniswapV2GraphClient: client => set({uniswapV2GraphClient: client}),

  tokenInputPriceUSD: {},
  setTokenInputPriceUSD: state => set({tokenInputPriceUSD: {...state}})



}))

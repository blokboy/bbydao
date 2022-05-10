import create from "zustand"

export const useDaoStore = create(set => ({
  // edit dao member modal display
  editDaoMemberModalOpen: false,
  setEditDaoMemberModalOpen: () => set(state => ({ editDaoMemberModalOpen: !state.editDaoMemberModalOpen })),

  // transaction modal display
  txModalOpen: false,
  setTxModalOpen: () => set(state => ({ txModalOpen: !state.txModalOpen })),

  // uniswap swap modal display
  uniswapSwapModalOpen: false,
  setUniswapSwapModalOpen: () => set(state => ({ uniswapSwapModalOpen: !state.uniswapSwapModalOpen })),

  // uniswap lp modal display
  uniswapLpModalOpen: false,
  setUniswapLpModalOpen: () => set(state => ({ uniswapLpModalOpen: !state.uniswapLpModalOpen })),

  // lpToken 0
  lpToken0: {},
  setLpToken0: lpToken0 => set(state => ({ lpToken0 })),

  // lpToken 1
  lpToken1: {},
  setLpToken1: lpToken1 => set(state => ({ lpToken1 })),
}))

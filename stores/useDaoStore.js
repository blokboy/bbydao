import create from "zustand"

export const useDaoStore = create(set => ({
  // edit dao member modal display
  editDaoMemberModalOpen: false,
  setEditDaoMemberModalOpen: () =>
    set(state => ({ editDaoMemberModalOpen: !state.editDaoMemberModalOpen })),

  // uniswap lp modal display
  uniswapLpModalOpen: false,
  tokenData: {},
  setUniswapLpModalOpen: token =>
    set(state => ({
      uniswapLpModalOpen: !state.uniswapLpModalOpen,
      tokenData: token,
    })),
}))

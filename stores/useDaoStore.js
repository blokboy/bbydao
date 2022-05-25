import create from "zustand"

export const useDaoStore = create(set => ({
  // transaction modal display
  txModalOpen: false,
  setTxModalOpen: () => set(state => ({ txModalOpen: !state.txModalOpen })),


}))

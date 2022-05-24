import create from "zustand"

export const useLayoutStore = create(set => ({
  signer: null,
  setSigner: signer => set({ signer }),

  searchOpen: false,
  setSearchOpen: () => set(state => ({ searchOpen: !state.searchOpen })),

  mintErrorModal: false,
  setMintErrorModal: () => set(state => ({ mintErrorModal: !state.mintErrorModal }))
}))

import create from "zustand"

export const useLayoutStore = create(set => ({
  searchOpen: false,
  setSearchOpen: () => set(state => ({ searchOpen: !state.searchOpen })),
}))
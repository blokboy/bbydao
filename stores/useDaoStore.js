import create from "zustand"

export const useDaoStore = create(set => ({
  // app modal display
  openSeaModalOpen: false,
  setOpenSeaModalOpen: () =>
    set(state => ({ openSeaModalOpen: !state.openSeaModalOpen })),
}))

import create from "zustand"

export const useOsStore = create(set => ({
  // os offer modal display
  osOfferModalOpen: false,
  setOsOfferModalOpen: () =>
    set(state => ({ osOfferModalOpen: !state.osOfferModalOpen })),

  // os asset info
  osAssetInfo: {},
  setOsAssetInfo: asset => set({ osAssetInfo: asset }),
}))

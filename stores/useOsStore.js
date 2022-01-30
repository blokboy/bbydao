import create from "zustand"

export const useOsStore = create(set => ({
  // os offer modal display
  osOfferModalOpen: false,
  setOsOfferModalOpen: () =>
    set(state => ({ osOfferModalOpen: !state.osOfferModalOpen })),

  // os offer modal display
  osBuyModalOpen: false,
  setOsBuyModalOpen: () =>
    set(state => ({ osBuyModalOpen: !state.osBuyModalOpen })),

  // os offer modal display
  osSellModalOpen: false,
  setOsSellModalOpen: () =>
    set(state => ({ osSellModalOpen: !state.osSellModalOpen })),

  // os asset info
  osAssetInfo: {},
  setOsAssetInfo: asset => set({ osAssetInfo: asset }),
}))

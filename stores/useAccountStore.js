import create from "zustand"

export const useAccountStore = create(set => ({
  rainbowAccount: undefined,
  setRainbowAccount: a => set({ rainbowAccount: a }),
  rainbowConnector: undefined,
  setRainbowConnector: c => set({ rainbowConnector: c }),
}))

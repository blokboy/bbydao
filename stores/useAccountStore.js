import create from "zustand"

export const useAccountStore = create(set => ({
  userData: null,
  rainbowAccount: null,
  rainbowConnector: null,
  setUserData: u => set({ userData: u }),
  setRainbowAccount: a => set({ rainbowAccount: a }),
  setRainbowConnector: c => set({ rainbowConnector: c }),
}))

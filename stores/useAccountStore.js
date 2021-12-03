import create from "zustand"
import { persist } from "zustand/middleware"

export const useAccountStore = create(
  persist(
    set => ({
      userData: null,
      rainbowAccount: null,
      rainbowConnector: null,
      setUserData: u => set({ userData: u }),
      setRainbowAccount: a => set({ rainbowAccount: a }),
      setRainbowConnector: c => set({ rainbowConnector: c }),
    }),
    {
      name: "account-storage", // name of item in the storage (must be unique)
      partialize: state => ({
        userData: state.userData,
        rainbowAccount: state.rainbowAccount,
      }),
    }
  )
)

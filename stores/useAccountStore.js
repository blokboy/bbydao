import create from "zustand"
import { persist } from "zustand/middleware"

export const useAccountStore = create(
  persist(
    set => ({
      userData: null,
      setUserData: u => set({ userData: u }),
      setUpdateUserData: update =>
        set(state => Object.assign(state.userData, update)),
    }),
    {
      name: "account-storage", // name of item in the storage (must be unique)
      partialize: state => ({
        userData: state.userData,
      }),
    }
  )
)

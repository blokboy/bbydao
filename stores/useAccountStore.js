import create from "zustand"

export const useAccountStore = create(set => ({
  userData: null,
  setUserData: u => set({ userData: u }),
  setUpdateUserData: update =>
    set(state => Object.assign(state.userData, update)),
}))

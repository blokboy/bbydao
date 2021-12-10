import create from "zustand"

export const useUiStore = create(set => ({
  modalOpen: false,
  notificationCount: null,
  setModalOpen: () => set(state => ({ modalOpen: !state.modalOpen })),
  setNotificationCount: count => set({ notificationCount: count }),
}))

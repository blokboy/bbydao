import create from "zustand"

export const useUiStore = create(set => ({
  modalOpen: false,
  notificationCount: null,
  messagesCount: null,
  setModalOpen: () => set(state => ({ modalOpen: !state.modalOpen })),
  setNotificationCount: count => set({ notificationCount: count }),
  setMessagesCount: count => set({ messagesCount: count }),
}))

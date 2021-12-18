import create from "zustand"

export const useUiStore = create(set => ({
  appModalOpen: false,
  notificationCount: null,
  messagesCount: null,
  setAppModalOpen: () => set(state => ({ appModalOpen: !state.appModalOpen })),
  setNotificationCount: count => set({ notificationCount: count }),
  setMessagesCount: count => set({ messagesCount: count }),
}))

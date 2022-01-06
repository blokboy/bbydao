import create from "zustand"

export const useUiStore = create(set => ({
  // app modal display
  appModalOpen: false,
  setAppModalOpen: () => set(state => ({ appModalOpen: !state.appModalOpen })),

  // notification count on nav
  notificationCount: null,
  setNotificationCount: count => set({ notificationCount: count }),

  // message count on nav
  messagesCount: null,
  setMessagesCount: count => set({ messagesCount: count }),
}))

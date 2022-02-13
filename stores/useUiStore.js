import create from "zustand"

export const useUiStore = create(set => ({
  // app modal display
  appModalOpen: false,
  setAppModalOpen: () => set(state => ({ appModalOpen: !state.appModalOpen })),

  // create dao modal display
  createDaoModalOpen: false,
  setCreateDaoModalOpen: () =>
    set(state => ({ createDaoModalOpen: !state.createDaoModalOpen })),

  // connect modal display
  connectModalOpen: false,
  setConnectModalOpen: () =>
    set(state => ({ connectModalOpen: !state.connectModalOpen })),

  // create thread modal display
  createThreadModalOpen: false,
  setCreateThreadModalOpen: () =>
    set(state => ({ createThreadModalOpen: !state.createThreadModalOpen })),

  // notification count on nav
  notificationCount: null,
  setNotificationCount: count => set({ notificationCount: count }),

  // message count on nav
  messagesCount: null,
  setMessagesCount: count => set({ messagesCount: count }),
}))

import create from "zustand"

export const useUiStore = create(set => ({
  // app modal display
  appModalOpen: false,
  setAppModalOpen: () => set(state => ({ appModalOpen: !state.appModalOpen })),

  // create dao modal display
  createDaoModalOpen: false,
  setCreateDaoModalOpen: () =>
    set(state => ({ createDaoModalOpen: !state.createDaoModalOpen })),

  // transaction modal display
  txModalOpen: false,
  setTxModalOpen: () => set(state => ({ txModalOpen: !state.txModalOpen })),

  // follow dao modal display
  followDaoModalOpen: false,
  setFollowDaoModalOpen: () =>
    set(state => ({ followDaoModalOpen: !state.followDaoModalOpen })),

  // connect modal display
  connectModalOpen: false,
  setConnectModalOpen: () =>
    set(state => ({ connectModalOpen: !state.connectModalOpen })),

  // create thread modal display
  createThreadModalOpen: false,
  setCreateThreadModalOpen: () =>
    set(state => ({ createThreadModalOpen: !state.createThreadModalOpen })),

  // friends modal display
  friendsModalOpen: false,
  setFriendsModalOpen: () =>
    set(state => ({ friendsModalOpen: !state.friendsModalOpen })),

  friendsModalAddress: null,
  setFriendsModalAddress: address => set({ friendsModalAddress: address }),

  // notification count on nav
  notificationCount: null,
  setNotificationCount: count => set({ notificationCount: count }),

  // message count on nav
  messagesCount: null,
  setMessagesCount: count => set({ messagesCount: count }),
}))

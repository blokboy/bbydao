import create from "zustand"

export const useMessageStore = create(set => ({
  channelAddress: null,
  setChannelAddress: address => set({ channelAddress: address }),

  threadChannel: null,
  setThreadChannel: channel => set({ threadChannel: channel }),

  // dao or user view - msg list view
  inboxListView: false,
  setInboxListView: () =>
    set(state => ({ inboxListView: !state.inboxListView })),
}))

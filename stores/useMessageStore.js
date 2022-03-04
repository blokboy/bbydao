import create from "zustand"

export const useMessageStore = create(set => ({
  threadChannel: null,
  setThreadChannel: channel => set({ threadChannel: channel }),

  // dao or user view - msg list view
  daoListView: false,
  setDaoListView: () => set(state => ({ daoListView: !state.daoListView })),
}))

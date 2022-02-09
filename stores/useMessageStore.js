import create from "zustand"

export const useMessageStore = create(set => ({
  threadChannel: null,
  setThreadChannel: channel => set({ threadChannel: channel }),
}))

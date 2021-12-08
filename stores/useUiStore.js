import create from "zustand"

export const useUiStore = create(set => ({
  modalOpen: false,
  setModalOpen: () => set(state => ({ modalOpen: !state.modalOpen })),
}))

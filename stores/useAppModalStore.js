import create from "zustand"

export const useAppModalStore = create(set => ({
  modalOpen: false,
  setModalOpen: () => set(state => ({ modalOpen: !state.modalOpen })),
}))

import { create } from 'zustand'

type ModalId = string

interface ModalStore {
    openModals: Set<ModalId>
    openModal: (id: ModalId) => void
    closeModal: (id: ModalId) => void
    closeAllModals: () => void
    isModalOpen: (id: ModalId) => boolean
}

export const useModalStore = create<ModalStore>((set, get) => ({
    openModals: new Set<ModalId>(),

    openModal: (id: ModalId) => set((state) => ({
        openModals: new Set(state.openModals).add(id)
    })),

    closeModal: (id: ModalId) => set((state) => {
        const newOpenModals = new Set(state.openModals)
        newOpenModals.delete(id)
        return { openModals: newOpenModals }
    }),

    closeAllModals: () => set({ openModals: new Set() }),

    isModalOpen: (id: ModalId) => get().openModals.has(id),
}))
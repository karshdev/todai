import { useModalStore } from "@/lib/zustand/modalStore"

export const useModal = () => {
    const { openModals, openModal, closeModal, closeAllModals, isModalOpen } = useModalStore()

    return {
        openModal,
        closeModal,
        closeAllModals,
        isModalOpen,
        openModals
    }
}
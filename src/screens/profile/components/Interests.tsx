import TodaiDialog from '@/components/dialog/TodaiDialog';
import { useModal } from '@/hooks/useModal';
import Onboarding from '@/screens/onboarding';
import { useQueryClient } from '@tanstack/react-query';

function Interests(data: any) {
    const { isModalOpen, closeModal } = useModal()
    const queryCliet = useQueryClient();
    return (
        <TodaiDialog
            open={isModalOpen('interests')}
            setOpen={() => closeModal('interests')}
            dialogTitle='Update Interest'
            content={
                <Onboarding selectedData={data} queryCliet={queryCliet} />
            }
            dialogWidth='100%'
            extraClass='!p-4 h-auto !w-fit'
        />
    )
}

export default Interests
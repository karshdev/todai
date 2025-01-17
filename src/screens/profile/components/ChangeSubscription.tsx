import TodaiDialog from "@/components/dialog/TodaiDialog";
import { useModal } from "@/hooks/useModal";
import { Pricing } from "@/screens/pricing/Pricing";
import { useQueryClient } from "@tanstack/react-query";

function ChangeSubscription() {
  const { isModalOpen, closeModal } = useModal();
  const queryClient = useQueryClient();
  return (
    <TodaiDialog
      open={isModalOpen("pricing")}
      setOpen={() => closeModal("pricing")}
      dialogTitle="Change Plan"
      content={<Pricing manageSubscription={true} queryClient={queryClient} />}
      dialogWidth="w-[90%] xl:w-[1300px] h-[90%]"
      extraClass="!p-4"
    />
  );
}

export default ChangeSubscription;

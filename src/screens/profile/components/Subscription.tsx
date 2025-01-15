import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import { TodaiButton } from "@/components/TodaiButton";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModal";
import { manageSubscription } from "@/lib/axios/api";
import NumberFlow from "@number-flow/react";
import { IconStatusChange } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ChangeSubscription from "./ChangeSubscription";

type SubscriptionProps = {
  subscribed_to: string;
  price: number;
};
function Subscription({ subscribed_to, price }: SubscriptionProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => manageSubscription({ cancel: true }),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["updateProfile"] });
      setLoading(false);
      toast({
        title: response?.data?.status || "Successfully changed plan",
        description:
          response.data.message || "Subscription has been changed to Free",
      });
    },
    onError: () => {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Please try again",
      });
    },
  });
  return (
    <div className="container gap-6 bg-white w-full border-t pt-5 pb-10">
      <h3 className="text-base font-semibold ">Subscription Details</h3>
      <p className="text-xs text-gray-600">Active plan details.</p>
      <div className="flex gap-16 mt-5 max-w-2xl justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Plan
          </label>
          <label className="block text-gray-700 mb-1 font-semibold">
            {subscribed_to}
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Price
          </label>
          {/* <label className="block text-sm font-semibold text-gray-700 mb-1">
            {price}
          </label> */}
          <NumberFlow
            value={price}
            prefix="$"
            className="my-0 font-semibold text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex gap-2">
          <TodaiButton
            variant="primary-outline"
            type="button"
            loading={loading}
            disabled={loading}
            onClick={() => {
              setLoading(true);
              mutate();
            }}
            className="shadow-md text-xs h-10  w-24  rounded-full border-red-400 hover:bg-red-300 text-red-700 flex justify-center items-center">
            Cancel
          </TodaiButton>
          <TodaiAnimatedButton
            variant="primary"
            type="button"
            onClick={() => openModal("pricing")}
            className="shadow-md !text-xs h-10  w-40 py-1 rounded-full">
            <IconStatusChange />
            Change plan
          </TodaiAnimatedButton>
        </div>
      </div>
      <ChangeSubscription />
    </div>
  );
}

export default Subscription;

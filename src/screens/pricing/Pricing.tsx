"use client";
import { EnhancedButton } from "@/components/button/AnimatedButton";
import { ShineBorder } from "@/components/card/ShineBoarder";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModal";
import { manageSubscription, subscription } from "@/lib/axios/api";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SubscriptionPlan {
  subscription_id?: number;
  cancel?: boolean;
}

interface SubscriptionResponse {
  status: number;
  data: {
    status: string;
    message: string;
    data?: {
      url?: string;
    };
  };
}

const pricingPlans = [
  {
    id: 2,
    name: "Give it a try",
    description: "Try everything for $5 for 5 days. Simple.",
    price: 1,
    priceDescription: "$1 per day for 5 day minimum",
    link: "#",
    features: [
      "Access to features",
      "Ideation tools",
      "Creation tools",
      "Learning tools",
      "Scheduling tools",
      "1 video creation per day",
    ],
  },
  // {
  //   id: 3,
  //   name: "Turbo Charge",
  //   description: "All the ideation and creation tools you need to get going",
  //   price: 38,
  //   priceDescription: "per single license",
  //   link: "#",
  //   features: [
  //     "Ideation tools",
  //     "Carousel creation tool",
  //     "Quote creation tool",
  //     "Learning tools",
  //     "Post and schedule from todai",
  //     "Standard support",
  //   ],
  // },
  {
    id: 4,
    name: "Turbo Charge +",
    description: "Everything you need to build your personal brand, forever",
    price: 45,
    priceDescription: "per single license",
    link: "#",
    features: [
      "Everything in Turbo-Charge",
      "Access to all features",
      "15 video cuts a month",
      "Unlimited AI ideation",
      "Priority support",
      "First access to new features",
    ],
  },
];

type PricingProps = {
  manageSubscription?: boolean;
  queryClient?: any;
};
export const Pricing = ({
  manageSubscription: manageSubs = false,
  queryClient,
}: PricingProps = {}) => {
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);
  // const queryClient = useQueryClient();
  const { toast } = useToast();
  const { closeModal } = useModal();

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const handleSubscribe = async (planId: number): Promise<void> => {
    try {
      setLoading(planId);
      setError(null);

      const plan: SubscriptionPlan = {
        subscription_id: planId,
        ...(manageSubs && { cancel: false }),
      };
      const response = (await (manageSubs
        ? manageSubscription(plan)
        : subscription(plan))) as SubscriptionResponse;

      if (!response?.status) {
        throw new Error("Invalid response received");
      }
      const { status, data } = response;
      if (status === 200) {
        if (data.data?.url) {
          window.location.href = data.data.url;
          return;
        }

        queryClient.invalidateQueries({ queryKey: ["updateProfile"] });
        closeModal("pricing");
        toast({
          title: data.status,
          description: data.message,
        });
      } else {
        throw new Error(`Request failed with status: ${status}`);
      }
    } catch (err: any) {
      const errorMessage = err
        ? err?.response?.data?.message
        : "An unknown error occurred";
      setError(errorMessage);
      console.error("Subscription error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const Heading = () => (
    <div
      className={`relative z-10  flex flex-col items-center justify-center gap-4 ${
        manageSubs ? "mt-3 mb-8" : "my-12"
      }`}>
      <div className="flex w-full flex-col items-start justify-center space-y-4 md:items-center">
        {!manageSubs && (
          <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-[0.20rem] text-xs font-medium uppercase text-blue-500 dark:bg-red-200">
            Pricing
          </div>
        )}
        <p
          className={cn(
            `mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl dark:text-gray-200`,
            { "mt-0": manageSubs }
          )}>
          Fair pricing, unfair advantage.
        </p>
        <p className="text-md max-w-xl text-gray-700 md:text-center dark:text-gray-300">
          Get started with Todai today and take your personal brand to the next
          level.
        </p>
      </div>
    </div>
  );

  const PricingCards = () => (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:gap-4">
      {pricingPlans.map((plan, index) => {
        if (plan.name !== "Turbo Charge +") {
          return (
            <div
              key={index}
              className=" w-full rounded-xl border-[1px] border-gray-100 shadow-xl p-6 text-left dark:border-gray-600 relative flex flex-col">
              <div className="flex-grow">
                <div className="text-center">
                  <p className="mb-1 mt-0 text-2xl font-semibold">
                    {plan.name}
                  </p>
                  <div className="mb-1 overflow-hidden">
                    <NumberFlow
                      value={plan.price}
                      // format={{
                      //   style: "currency",
                      //   currency: "USD",
                      //   trailingZeroDisplay: "stripIfInteger",
                      //   compactDisplay: "short",
                      // }}
                      prefix="$"
                      className="my-0 text-5xl font-semibold text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <p className="my-0 mb-6 text-sm text-gray-400">
                    {plan.priceDescription}
                  </p>
                </div>
                <p className="my-0 mb-6 text-lg text-gray-600 text-center">
                  {plan.description}
                </p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="mb-3 flex items-center gap-2">
                    <div className="bg-green-100 rounded-full">
                      <Check
                        className="text-green-800 w-6 h-6 p-1"
                        strokeWidth="1"
                      />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
              <EnhancedButton
                loading={loading == plan.id}
                onClick={() => handleSubscribe(plan.id)}
                variant="expandIcon"
                Icon={ArrowRight}
                iconPlacement="right"
                size={"lg"}
                className="rounded-full !py-3 mt-6">
                <span className="flex-1">Get Started</span>
              </EnhancedButton>
            </div>
          );
        } else {
          return (
            <ShineBorder
              key={index}
              className=" relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl p-0"
              color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
              <div className="w-full rounded-xl p-6 text-left relative flex flex-col">
                <div className="flex-grow">
                  <div className="text-center">
                    <p className="mb-1 mt-0 text-2xl font-semibold">
                      {plan.name}
                    </p>
                    <div className="mb-1 overflow-hidden">
                      <NumberFlow
                        value={plan.price}
                        // format={{
                        //   style: "currency",
                        //   currency: "USD",
                        //   trailingZeroDisplay: "stripIfInteger",
                        // }}
                        prefix="$"
                        className="my-0 text-5xl font-semibold text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <p className="my-0 mb-6 text-sm text-gray-400">
                      {plan.priceDescription}
                    </p>
                  </div>
                  <p className="my-0 mb-6 text-lg text-gray-600 text-center">
                    {plan.description}
                  </p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="mb-3 flex items-center gap-2">
                      <div className="bg-green-100 rounded-full">
                        <Check
                          className="text-green-800 w-6 h-6 p-1"
                          strokeWidth="1"
                        />
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <EnhancedButton
                  loading={loading == plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                  variant="expandIcon"
                  Icon={ArrowRight}
                  iconPlacement="right"
                  size={"lg"}
                  className="rounded-full !py-3 mt-6">
                  <span className="flex-1">Get Started</span>
                </EnhancedButton>
              </div>
            </ShineBorder>
          );
        }
      })}
    </div>
  );

  return (
    <section className="container relative w-full h-full overflow-y-auto text-black ">
      <Heading />
      <PricingCards />
      {error && (
        <div className="p-4 w-full text-center text-red-500">{error}</div>
      )}
    </section>
  );
};

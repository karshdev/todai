"use client";
import TodaiLogo from "@/assets/img/todailogobig.png";
import { TodaiImage } from "@/components/TodaiImage";
import TodaiInput from "@/components/TodaiInput";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModal";
import {
  getAllDefaultInterests,
  postInterest,
  updateInterest,
} from "@/lib/axios/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import MultiSelectDropdown from "./components/MultiselectDD";
import { OnboardingSchema } from "./types/onboarding";
import { ErrorMessage } from "../auth/types/signin";

type FormProps = {
  selectedData?: any;
  queryCliet?: any;
};

type Inputs = z.infer<typeof OnboardingSchema>;

interface InterestsAccumulator {
  defaultInterests: number[];
  customInterests: string[];
}

const steps = [
  {
    id: "Step 1",
    name: "Interest",
    fields: ["interest"],
  },
  {
    id: "Step 2",
    name: "Tone of voice",
    fields: ["tone_of_voice"],
  },
  { id: "Step 3", name: "Instructions", fields: ["instructions"] },
];

export default function Form({ selectedData, queryCliet }: FormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { closeModal } = useModal();
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [defaultInterest, setDefaulInterest] = useState([{ id: "", name: "" }]);
  const [selectedInterest, setSelectedInterest] = useState<
    { label: string; value: string }[]
  >([]);
  const delta = currentStep - previousStep;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(OnboardingSchema),
  });

  const defaultinrt = async () => {
    const data = await getAllDefaultInterests();
    setDefaulInterest(data?.data?.data);
  };

  useEffect(() => {
    defaultinrt();
  }, []);

  useEffect(() => {
    if (selectedData) {
      loadData();
    }
  }, [defaultInterest]);

  function loadData() {
    const interestList = selectedData?.data?.interests.map((item: any) => {
      const foundInterest = defaultInterest.find(
        (defaultInterest: any) =>
          defaultInterest.id === item.id && defaultInterest.name === item.name
      );
      if (foundInterest) {
        return { label: foundInterest.name, value: foundInterest.id };
      } else {
        return { label: item.name, value: item.name };
      }
    });
    setSelectedInterest(interestList);
    setValue("interest", ["interestList"] as [string, ...string[]]);
    setValue("tone_of_voice", selectedData?.data?.tone_of_voice);
    setValue("instructions", selectedData?.data?.instructions);
  }

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      const { defaultInterests, customInterests } =
        selectedInterest.reduce<InterestsAccumulator>(
          (acc, interest) => {
            if (typeof interest.value === "number") {
              acc.defaultInterests.push(interest.value);
            } else if (typeof interest.value === "string") {
              acc.customInterests.push(interest.value);
            }
            return acc;
          },
          { defaultInterests: [], customInterests: [] }
        );

      const InterestData = {
        default_interests: defaultInterests,
        custom_interests: customInterests,
        tone_of_voice: data.tone_of_voice,
        instructions: data.instructions,
      };
      let response: any = null;
      if (selectedData) {
        response = await updateInterest(InterestData);
      } else {
        response = await postInterest(InterestData);
      }
      if (response?.status === 200) {
        reset();
        toast({
          title: response.data.status,
          description: response.data.message,
        });
        try {
          if (selectedData) {
            closeModal("interests");
            queryCliet.invalidateQueries(["userInterest"]);
          } else {
            await router.push("/");
          }
          toast({
            title: response.data.status,
            description: response.data.message,
          });
        } catch (error) {
          setTimeout(async () => {
            try {
              await router.push("/");
            } catch (error) {
              console.error("Failed to navigate to home page:", error);
            }
          }, 1000);
        }
      } else {
        throw new Error("Failed to update interests");
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          "There was an error updating your interests. Please try again.",
      });
    }
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep <= steps.length - 1) {
      if (currentStep === steps.length - 1) {
        await handleSubmit(processForm)();
      } else {
        setPreviousStep(currentStep);
        setCurrentStep((step) => step + 1);
      }
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const handleMultiSelectChange = (
    selected: { label: string; value: string }[]
  ) => {
    setSelectedInterest(selected);

    const selectedLabels = selected.map((item) => item.label);
    if (selectedLabels.length > 0) {
      setValue("interest", selectedLabels as [string, ...string[]]);
    } else {
      setValue("interest", [] as unknown as [string, ...string[]]);
    }
  };

  return (
    <section className="container xl:w-[900px] h-screen inset-0 flex flex-col gap-10 p-24  overflow-y-auto">
      {!selectedData && (
        <TodaiImage
          src={TodaiLogo}
          className="absolute top-5 self-center h-10 w-44"
          width={450}
          height={500}
          alt="logo"
        />
      )}
      {/* steps */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-xs font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step">
                  <span className="text-xs font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-xs font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className="mt-5 py-3" onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <p className="text-xs text-slate-500">Configure your personal AI</p>
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Define your topics
            </h2>
            <p className="mt-6 text-sm leading-6 text-gray-600">
              What do you want to post about?
            </p>
            <div className="mt-10 ">
              <MultiSelectDropdown
                options={defaultInterest.map((interest) => ({
                  label: interest.name,
                  value: interest.id,
                }))}
                selectedOptions={selectedInterest}
                onChange={handleMultiSelectChange}
                setSelectedOptions={setSelectedInterest}
              />
              {errors.interest?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.interest.message}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <p className="text-xs text-slate-500">Configure your personal AI</p>
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              How would you describe yourself on LinkedIn?
            </h2>
            <p className="mt-6 text-sm leading-6 text-gray-600 border-slate-400">
              Who are you? What is it you do and talk about?
            </p>

            <div className="mt-10">
              <TodaiInput
                name="tone_of_voice"
                type="text"
                label="Describe the tone"
                placeholder="Informative, motivational, conversational"
                inputClass="!border-slate-200 text-black"
                register={register("tone_of_voice")}
                errorMessage={errors?.tone_of_voice as ErrorMessage}
              />
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <TodaiInput
              name="instructions"
              type="textarea"
              register={register("instructions")}
              errorMessage={errors?.instructions as ErrorMessage}
              inputClass="border !border-slate-200 text-slate-800"
              label="Instructions"
              placeholder="posts must sound energetic and should be written with passion"
            />
          </motion.div>
        )}
      </form>

      {/* Navigation */}
      <div className="mt-0 pt-5">
        <div className="grid grid-cols-2 justify-between w-full items-center">
          <div>
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0}
              className="justify-self-start rounded bg-white flex items-center px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:hidden">
              <ChevronLeft />
              Prev
            </button>
          </div>
          {currentStep != 2 ? (
            <button
              type="button"
              onClick={next}
              disabled={currentStep === steps.length - 1}
              className="place-self-end rounded bg-white px-2 py-1 flex items-center text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:hidden">
              Next
              <ChevronRight />
            </button>
          ) : (
            <div className="flex justify-center place-self-end">
              <button
                type="button"
                onClick={next}
                className="rounded-3xl px-5 py-2.5 overflow-hidden group bg-brand-primary relative hover:bg-gradient-to-r hover:bg-brand-primary hover:to-cyan-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-bg-brand-primary transition-all ease-out duration-300">
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40"></span>
                <span className="relative">Time to roll!</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

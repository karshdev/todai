"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import TodaiInput from "@/components/TodaiInput";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { contactUsPostMessage, PropBravoPostData } from "@/lib/axios/api";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof schema>;
const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};
const ContactForm: React.FC = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission
    const postData: PropBravoPostData = {
      email: data.email,
      attributes: {
        FIRSTNAME: data.firstName,
        LASTNAME: data.lastName,
        MESSAGE: data.message,
      },
      listIds: [8],
    };
    mutate(postData);
  };

  const {
    mutate,
    data: sendMessage,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (postText: PropBravoPostData) => contactUsPostMessage(postText),
    onSuccess: (data: any) => {
      toast({
        title: "Great News!",
        description:
          "Your message has been sent successfully. We'll reach out soon.",
      });
      reset(defaultValues);
    },
    onError: (error: any) => {
      console.error("Mutation failed:", error);
      if (error?.response?.data?.code == "duplicate_parameter") {
        toast({
          title: "Email already exists",
          description: error?.response?.data?.message,
        });
        return;
      }
      toast({
        title: "Oops",
        description: "Something went wrong. Unable to send your message.",
      });
    },
  });

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" bg-gray-50 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          Plus more features to come...
        </h2>
        <p className="mb-8">
          If you think we really need to add a new feature that you and others
          would benefit from, please drop us a line using the form below
        </p>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <div className="flex justify-between w-full">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <TodaiInput
              type="text"
              {...register("firstName")}
              inputClass={`mt-1 p-2 w-full border bg-transparent ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between w-full">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <TodaiInput
              type="text"
              {...register("lastName")}
              inputClass={`mt-1 p-2 w-full border bg-transparent ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between w-full">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 animate-pulse">
                {errors.email.message}
              </p>
            )}
          </div>
          <TodaiInput
            type="email"
            {...register("email")}
            inputClass={`mt-1 p-2 w-full border bg-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
        </div>
        <div className="mb-4">
          <div className="flex justify-between w-full">
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            {errors.message && (
              <p className="text-red-500 text-xs mt-1 animate-pulse">
                {errors.message.message}
              </p>
            )}
          </div>
          <TodaiInput
            type="textarea"
            inputClass="border bg-transparent"
            {...register("message")}
            className={`mt-1 p-2 w-full border  ${
              errors.message ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
        </div>
        <div className="text-center">
          <TodaiAnimatedButton
            variant="primary"
            type="submit"
            className=""
            disabled={isPending}
            loading={isPending}>
            Contact Us
          </TodaiAnimatedButton>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

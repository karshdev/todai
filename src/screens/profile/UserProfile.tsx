"use client";
import dummyavatar from "@/assets/img/avatar-dummy.jpeg";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import TodaiIcon from "@/components/icon/TodaiIcon";
import { TodaiImage } from "@/components/TodaiImage";
import TodaiInput from "@/components/TodaiInput";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModal";
import { useProfile } from "@/hooks/useProfile";
import { updateProfileInfo } from "@/lib/axios/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEdit, IconKey, IconPencilCheck } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ChangePassword from "./components/ChangePassword";
import InterestList from "./components/InterestList";
import SocialConnections from "./components/SocialConnections";
import Subscription from "./components/Subscription";
import { ErrorMessage, Inputs, ProfileSchema } from "./types/types";
import useLocalStorage from "@/hooks/useLocalStorage";

const UserProfile = () => {
  const { toast } = useToast();
  const { openModal } = useModal();
  const [name, setName, removeName] = useLocalStorage("lastVisited", "");

  const [edit, setEdit] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(ProfileSchema),
  });

  const { data: profileInfo } = useProfile();

  useEffect(() => {
    if (name === "/profile") removeName();
  }, []);

  useEffect(() => {
    if (profileInfo) {
      setValue("first_name", profileInfo.first_name);
      setValue("last_name", profileInfo.last_name);
    }
  }, [profileInfo, setValue]);

  const handleEditPersonalInfo = () => {
    setEdit((prev) => !prev);
  };

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      mutation.mutate(data);
    } catch (error) {
      // toast({
      //     title: "Update Failed",
      //     description: "There was an error updating your interests. Please try again.",
      // });
    }
  };
  type ProfileInfo = { first_name: string; last_name: string };
  const mutation = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (data: ProfileInfo) => updateProfileInfo(data),
    onSuccess: () => {
      toast({
        title: "Updated successfully",
        description: "Personal info updates successfully",
      });
      setEdit(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your info. Please try again.",
      });
    },
  });

  return (
    <div className="container w-full mx-auto rounded-lg mt-10 max-w-6xl">
      <div className="space-y-5 shadow-lg !rounded-lg pb-5">
        <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-blue-100 via-white to-yellow-100 rounded-t-lg">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <TodaiImage
                className="object-cover"
                src={profileInfo?.image || dummyavatar}
                alt="profile img"
                width={100}
                height={100}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {profileInfo?.first_name} {profileInfo?.last_name}
              </h2>
              <p className="text-sm text-gray-600">{profileInfo?.email}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <form
            className="relative container grid grid-cols-2 gap-6 bg-white w-full"
            onSubmit={handleSubmit(processForm)}>
            <div>
              <TodaiInput
                disabled={!edit}
                type="text"
                placeholder="Your First Name"
                className="w-full p-2 border border-gray-300 rounded-md"
                name="first_name"
                register={register("first_name")}
                errorMessage={errors?.first_name as ErrorMessage}
                inputClass="border !border-slate-200"
                label="First Name"
              />
            </div>
            <div>
              <TodaiInput
                disabled={!edit}
                type="text"
                placeholder="Your Last Name"
                className="w-full p-2 border border-gray-300 rounded-md"
                name="last_name"
                register={register("last_name")}
                errorMessage={errors?.last_name as ErrorMessage}
                inputClass="border !border-slate-200"
                label="Last Name"
              />
            </div>

            <div className="col-span-2 flex justify-between ">
              <div className="place-self-start">
                <label
                  className="flex items-center gap-1 text-sm font-medium text-brand-primary cursor-pointer mb-1 w-fit"
                  onClick={() => openModal("changePassword")}>
                  <IconKey />
                  Change Password
                </label>
                <ChangePassword />
              </div>
              {edit && (
                <div>
                  <TodaiAnimatedButton
                    type="submit"
                    variant="primary"
                    className="px-5 py-2 !text-sm shadow-md"
                    disabled={!edit}>
                    <IconPencilCheck />
                    Update
                  </TodaiAnimatedButton>
                </div>
              )}
            </div>

            <div
              className="absolute right-7 -top-6"
              onClick={handleEditPersonalInfo}>
              <TodaiIcon>
                <IconEdit
                  className="text-brand-primary hover:bg-slate-100 rounded-sm cursor-pointer"
                  stroke={2}
                />
              </TodaiIcon>
            </div>
          </form>
        </div>
        <InterestList />
        <SocialConnections />
        <Subscription
          subscribed_to={profileInfo?.subscribed_to?.name}
          price={profileInfo?.subscribed_to?.price}
        />
      </div>
    </div>
  );
};

export default UserProfile;

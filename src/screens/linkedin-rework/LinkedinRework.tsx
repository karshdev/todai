"use client";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import TodaiSheet from "@/components/sheet/TodaiSheet";
import TodaiInput from "@/components/TodaiInput";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModal";
import { useProfile } from "@/hooks/useProfile";
import { postLinkedinRework } from "@/lib/axios/api";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import EditPost from "../home/components/EditPost";
import { PropEditPost } from "../linkedin-viral-content/LinkedInViralContant";

function LinkedinRework() {
  const [text, setText] = useState<string>("");
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [editPost, setEditPost] = useState({
    showSheet: false,
    sheetTitle: "",
    profileUrl: "",
    postContent: "",
  });
  const { data: profileInfo } = useProfile();
  const { isModalOpen, openModal, closeModal } = useModal();

  const { mutate } = useMutation({
    mutationFn: () => postLinkedinRework({ url: text }),
    onSuccess: (response: any) => {
      const linkedinReworkResponse = response?.data?.data;
        handleEditPost({
          content: linkedinReworkResponse.text,
          profileUrl: profileInfo?.image,
          thumbnailUrl: "",
        });
      setLoading(false);
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

  const handleSubmitLinkedinRework = (e: any) => {
    e.preventDefault();

    const linkedinPostRegex =
      /^https:\/\/(www\.)?linkedin\.com\/posts\/[a-zA-Z0-9_-]+/;

    if (text === "" || !linkedinPostRegex.test(text)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please provide a valid LinkedIn post URL.",
      });
      return;
    }
    setLoading(true);
    mutate();
  };

  const handleEditPost = ({ content, profileUrl }: PropEditPost) => {
    openModal("editSheet");
    setEditPost((prev) => ({
      ...prev,
      showSheet: true,
      postContent: content,
      profileUrl,
    }));
  };

  const handleCloseSheet = () => {
    setEditPost((prev) => ({ ...prev, showSheet: false }));
    closeModal("editSheet");
  };

  return (
    <div className="w-full">
      <form
        className="flex w-full justify-center mt-10"
        onSubmit={handleSubmitLinkedinRework}>
        <div className="flex w-full lg:w-2/3 items-center justify-center rounded-full shadow-lg">
          <TodaiInput
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
            type="text"
            placeholder="Enter a LinkedIn post URL"
            extra="w-full"
            inputClass="flex-grow w-full !border-r-0 !p-4 border border-brand-primary !rounded-l-full !rounded-r-none !outline-none focus-visible:!ring-brand-primary"
          />
          <TodaiAnimatedButton
            onClick={handleSubmitLinkedinRework}
            disabled={loading}
            loading={loading}
            type="button"
            variant="primary"
            className="p-3 !w-40 self-stretch border border-brand-primary !rounded-l-none border-l-0 hover:text-white rounded-r-full hover:!ring-brand-primary">
            Submit
          </TodaiAnimatedButton>
        </div>
      </form>
      <div className="container mt-8 text-base ">
        <TodaiSheet
          openSheet={isModalOpen("editSheet")}
          onClose={handleCloseSheet}
          title="Write a post about:"
          sheetContent={
            <EditPost
              text={editPost?.postContent}
              thumbnailUrl={""}
              profileImgUrl={editPost.profileUrl}
            />
          }
        />
      </div>
    </div>
  );
}

export default LinkedinRework;

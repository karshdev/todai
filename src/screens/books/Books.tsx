"use client";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import TodaiSheet from "@/components/sheet/TodaiSheet";
import TodaiInput from "@/components/TodaiInput";
import TodaiTooltip from "@/components/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModal";
import { useProfile } from "@/hooks/useProfile";
import { IconPencilUp, IconRefresh } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import EditPost from "../home/components/EditPost";
import { PropEditPost } from "../linkedin-viral-content/LinkedInViralContant";
import { postBooks } from "@/lib/axios/api";

function Books() {
  const [text, setText] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [editPost, setEditPost] = useState({
    showSheet: false,
    sheetTitle: "",
    profileUrl: "",
    postContent: "",
  });
  const { data: profileInfo } = useProfile();
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    if (index < content?.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + content.charAt(index));
        setIndex(index + 1);
      }, 5); // Adjust typing speed here
      return () => clearTimeout(timeout);
    }
  }, [index, content]);

  const { mutate } = useMutation({
    mutationFn: () => postBooks({ content: text }),
    onSuccess: (response: any) => {
      const topVoice = response?.data?.data;
      setContent(topVoice);
      setIndex(0);
      setDisplayedText("");
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

  const handleSubmitBooks = (e: any) => {
    e.preventDefault();
    if (text === "") {
      toast({
        variant: "destructive",
        title: "The input text is not valid.",
        description: "Please provide content.",
      });
      return;
    }
    setIndex(0);
    setDisplayedText("");
    setLoading(true);
    mutate();
  };

  const handleRefresh = () => {
    setLoading(true);
    setIndex(0);
    setDisplayedText("");
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
        className="flex w-full justify-center"
        onSubmit={handleSubmitBooks}>
        <div className="flex w-full lg:w-2/3 items-center justify-center rounded-full shadow-lg">
          <TodaiInput
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
            type="text"
            placeholder="Insert the name of the book you want to create a post for"
            extra="w-full"
            inputClass="flex-grow w-full !border-r-0 !p-4 border border-brand-primary !rounded-l-full !rounded-r-none !outline-none focus-visible:!ring-brand-primary"
          />
          <TodaiAnimatedButton
            onClick={handleSubmitBooks}
            type="button"
            variant="primary"
            className="p-3 !w-40 self-stretch border border-brand-primary !rounded-l-none border-l-0 hover:text-white rounded-r-full hover:!ring-brand-primary">
            Submit
          </TodaiAnimatedButton>
        </div>
      </form>
      <div className="container mt-8 text-base ">
        {!loading && content && (
          <motion.p
            className="mb-3 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            {/* {displayedText} */}
            <div
              dangerouslySetInnerHTML={{
                __html: displayedText,
              }}
              style={{
                whiteSpace: "pre-wrap",
              }}
            />
          </motion.p>
        )}
        {content && index >= content.length && (
          <div className="flex gap-2 transition-opacity duration-300 delay-300 animate-fade-in items-center">
            <TodaiTooltip
              tooltipContent="Refresh"
              triggerContent={
                // <TodaiIcon height={29} width={29}>
                <IconRefresh
                  className="cursor-pointer hover:bg-slate-200 rounded-md p-1 w-7 h-7 text-slate-400"
                  onClick={handleRefresh}
                />
                // </TodaiIcon>
              }
              delayDuration={800}
            />
            <TodaiTooltip
              tooltipContent="Edit & Post"
              triggerContent={
                // <TodaiIcon height={30} width={30}>
                <IconPencilUp
                  className="cursor-pointer hover:bg-slate-200 rounded-md p-1 w-7 h-7 text-slate-400"
                  onClick={() => {
                    handleEditPost({
                      content,
                      thumbnailUrl: "",
                      profileUrl: profileInfo?.authorImage,
                    });
                  }}
                />
                // </TodaiIcon>
              }
            />
          </div>
        )}
        {loading && <TodaiCircularLoader />}
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

export default Books;

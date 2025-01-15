"use client";
import dummyUserImg from "@/assets/img/avatar-dummy.jpeg";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import TodaiSheet from "@/components/sheet/TodaiSheet";
import { useModal } from "@/hooks/useModal";
import { useProfile } from "@/hooks/useProfile";
import { getAIContent } from "@/lib/axios/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import EditPost from "../home/components/EditPost";
import ViralPost from "../home/components/ViralPost";

type PropEditPost = {
  content: string;
  thumbnailUrl: string;
  profileUrl: string;
};

function AIContent() {
  const { isModalOpen, openModal, closeModal, openModals } = useModal();
  const { data: profile } = useProfile();
  const [editPost, setEditPost] = useState({
    showSheet: false,
    sheetTitle: "",
    thumbnailUrl: "",
    profileUrl: "",
    postContent: "",
  });

  const {
    data: aiContents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["aiContents"],
    queryFn: getAIContent,
    select: (data: any) => data?.data?.data,
  });

  const handleEditPost = ({
    content,
    thumbnailUrl,
    profileUrl,
  }: PropEditPost) => {
    openModal("editSheet");
    setEditPost((prev) => ({
      ...prev,
      showSheet: true,
      postContent: content,
      thumbnailUrl,
      profileUrl,
    }));
  };

  const handleCloseSheet = () => {
    setEditPost((prev) => ({ ...prev, showSheet: false }));
    closeModal("editSheet");
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex items-center flex-col my-1">
        <p className="text-xs text-slate-500">Ideate</p>
        <h1 className="text-3xl font-bold">AI Content</h1>
      </div>
      <TodaiSheet
        openSheet={isModalOpen("editSheet")}
        onClose={handleCloseSheet}
        title="Write a post about:"
        sheetContent={
          <EditPost
            text={editPost.postContent}
            thumbnailUrl={editPost.thumbnailUrl}
            profileImgUrl={editPost.profileUrl}
            handleCloseSheet={handleCloseSheet}
          />
        }
      />
      {!isLoading && aiContents?.length > 0 ? (
        <div className="flex flex-wrap w-full gap-4 ">
          {aiContents?.map((item: any, index: number) => (
            <div key={index} className="w-full lg:w-80 lg:max-w-96 flex-grow">
              <ViralPost
                key={index}
                thumbnail={`${item.image_url[0].url}`}
                authorImage={profile?.image || dummyUserImg}
                title={item.title}
                content={item.body}
                editFunction={handleEditPost}
                handleCloseSheet={handleCloseSheet}
              />
            </div>
          ))}
        </div>
      ) : (
        <TodaiCircularLoader />
      )}
    </>
  );
}

export default AIContent;

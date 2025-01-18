"use client";
import dummyAuthor from "@/assets/img/avatar-dummy.jpeg";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import TodaiSheet from "@/components/sheet/TodaiSheet";
import { TodaiButton } from "@/components/TodaiButton";
import TodaiTooltip from "@/components/tooltip";
import { useModal } from "@/hooks/useModal";
import { useProfile } from "@/hooks/useProfile";
import { getLinkedInPosts } from "@/lib/axios/api";
import { cn } from "@/lib/utils";
import EditPost from "@/screens/home/components/EditPost";
import ViralPost from "@/screens/home/components/ViralPost";
import { IconRefresh, IconReload } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type PropEditPost = {
  content: string;
  thumbnailUrl: string | "";
  profileUrl: string;
};

function LinkedInViralContent() {
  const { isModalOpen, openModal, closeModal } = useModal();
  const [editPost, setEditPost] = useState({
    showSheet: false,
    sheetTitle: "",
    thumbnailUrl: "",
    profileUrl: "",
    postContent: "",
  });

  const {
    data: linkenInPost,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["linkedInViralContent"],
    queryFn: getLinkedInPosts,
    select: (data: any) => data?.data?.data,
    staleTime: 5 * 60 * 1000,
  });

  const { data: profileInfo } = useProfile();

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

  if (isError) {
    return <div>Error fetching contents.. plese try again</div>;
  }

  return (
    <>
      <div className="flex justify-end items-center my-1 w-full">
        <div className="flex items-end justify-end flex-col flex-1">
          <div className="flex items-center flex-col">
            <p className="text-xs text-slate-500">Ideate</p>
            <h1 className="text-3xl font-bold">LinkedIn</h1>
          </div>
        </div>
        <div className="flex  justify-end items-center flex-1">
          {linkenInPost?.length > 0 && (
            <TodaiTooltip
              triggerContent={
                <div className="bg-transparent pr-5">
                  <div
                    className="border-slate-200 hover:bg-slate-200 !text-brand-primary rounded-md p-1 cursor-pointer"
                    onClick={() => refetch()}
                  >
                    <IconReload
                      className={cn(isRefetching && "animate-spin opacity-50")}
                    />
                  </div>
                </div>
              }
              tooltipContent="Refresh"
              dataSide="left"
            />
          )}
        </div>
      </div>
      <TodaiSheet
        openSheet={isModalOpen("editSheet")}
        onClose={handleCloseSheet}
        title="Write a post about:"
        sheetContent={
          <EditPost
            text={editPost?.postContent}
            thumbnailUrl={editPost.thumbnailUrl}
            profileImgUrl={editPost.profileUrl}
          />
        }
      />
      {!isLoading && linkenInPost.length > 0 && (
        <div className="flex flex-wrap w-full gap-4 ">
          {linkenInPost?.map((item: any, index: number) => (
            <div key={index} className="w-full lg:w-80 lg:max-w-96 flex-grow">
              <ViralPost
                key={index}
                thumbnail={item?.thumbnail}
                authorImage={profileInfo?.image || dummyAuthor}
                content={item?.text}
                editFunction={handleEditPost}
              />
            </div>
          ))}
        </div>
      )}
      {isLoading && <TodaiCircularLoader />}
    </>
  );
}

export default LinkedInViralContent;

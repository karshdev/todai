"use client";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import TodaiSheet from "@/components/sheet/TodaiSheet";
import { useModal } from "@/hooks/useModal";
import { fetchWorldNews } from "@/lib/axios/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import EditPost from "../home/components/EditPost";
import NewsCardComponent from "./components/NewsCard";
import TodaiTooltip from "@/components/tooltip";
import { IconReload } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const News = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const [editPost, setEditPost] = useState({
    showSheet: false,
    sheetTitle: "",
    thumbnailUrl: "",
    profileUrl: "",
    postContent: "",
  });

  const {
    data: worldNews,
    isLoading,
    isError,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ["worldNews"],
    queryFn: fetchWorldNews,
    select: (data: any) => data?.data?.data,
    staleTime: 5 * 60 * 1000,
  });

  const handleEditPost = (content: any) => {
    openModal("editSheet");
    setEditPost((prev) => ({ ...prev, showSheet: true, postContent: content }));
  };

  const handleCloseSheet = () => {
    setEditPost((prev) => ({ ...prev, showSheet: false }));
    closeModal("editSheet");
  };

  if (isError) {
    return <div>Error fetching news, please try again!</div>;
  }

  return (
    <>
      <div className="flex justify-end items-center my-1 w-full">
        <div className="flex items-end justify-end flex-col flex-1">
          <div className="flex items-center flex-col">
            <p className="text-xs text-slate-500">Ideate</p>
            <h1 className="text-3xl font-bold">World News</h1>
          </div>
        </div>
        <div className="flex  justify-end items-center flex-1">
          {worldNews?.length > 0 && (
            <TodaiTooltip
              triggerContent={
                <div className="bg-transparent pr-5">
                  <div
                    className="border-slate-200 hover:bg-slate-200 !text-brand-primary rounded-md p-1 cursor-pointer"
                    onClick={() => refetch()}>
                    <IconReload className={cn(isRefetching && "animate-spin opacity-50")} />
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
            text={editPost.postContent}
            thumbnailUrl={editPost.thumbnailUrl}
            profileImgUrl={editPost.profileUrl}
          />
        }
      />
      {!isLoading ? (
        <div className="flex justify-start flex-wrap w-full gap-4 p-2">
          {worldNews?.map((item: any, index: number) => (
            <div key={index} className="w-full lg:w-80 lg:max-w-96 flex-grow">
              <NewsCardComponent
                url={item.news_url}
                content={item?.text}
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
};

export default News;

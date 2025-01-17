"use client";
import { TodaiButton } from "@/components/TodaiButton";
import TodaiInput from "@/components/TodaiInput";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import LinkedInPreview from "@/components/linkedIn-peview/LinkedIn-Preview";
import TodaiSelect from "@/components/select/TodaiSelect";
import TodaiTooltip from "@/components/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useVideoTrimming } from "@/hooks/video/useVideoTrimmer";
import { fetchAiCaption, fetchClipMetaData } from "@/lib/axios/api";
import * as helpers from "@/lib/helper";
import { IconRestore } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader, MoveLeft, Scissors, SendIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import SeekBar from "./components/seekBar";
import Subtitles from "@/screens/subtitles/Subtitles";
import SubtitleEditor from "@/screens/subtitles/components/Subtitles";

interface AspectRatioBoxProps {
  style: string;
}

type VideoTrimmerProps = {
  inputVideo: { videoId: number; videoUrl: string };
  setInputVideo: React.Dispatch<
    React.SetStateAction<{ videoId: number; videoUrl: string }>
  >;
  showSubtitle?: boolean;
};

type VideoMetadata = {
  title: string;
  description: string;
  tags: string;
};

const VideoTrimmer = ({
  inputVideo,
  setInputVideo,
  showSubtitle = false,
}: VideoTrimmerProps) => {
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: "",
    description: "",
    tags: "",
  });

  const {
    trimmedVideoFile,
    videoMeta,
    trimIsProcessing,
    rStart,
    rEnd,
    thumbNails,
    thumbnailIsProcessing,
    error,
    setRstart,
    setRend,
    handleTrim,
    handleResize,
    aspectLoading,
    setTrimmedVideoFile,
  } = useVideoTrimming(inputVideo);
  const { toast } = useToast();
  const [postText, setPostText] = useState<string>("");
  const [generatingAiCaption, setGeneratingAiCaption] =
    useState<boolean>(false);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong..",
        description: error,
      });
    }
  }, [error, toast]);

  const handlevideoMetaDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMetadata((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGotoVideos = () => {
    setInputVideo({ videoId: 0, videoUrl: "" });
  };

  const {
    data: videoMetaData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["fetchMetaData", inputVideo.videoId],
    queryFn: () => fetchClipMetaData(inputVideo.videoId),
    enabled: !!inputVideo.videoId,
  });

  React.useEffect(() => {
    if (videoMetaData) {
      const metaData = videoMetaData.data.data;
      setMetadata({
        title: metaData.ai_title,
        description: metaData.ai_description,
        tags: metaData.ai_tags,
      });
    }
  }, [videoMetaData]);
  const [resetKey, setResetKey] = useState(0);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<
    string | undefined
  >(undefined);

  const aspectRatios = [
    {
      label: "Aspect Ratios",
      options: [
        { id: 2, value: "16:9", label: "Widescreen (16:9)", style: "w-7 h-4" },
        { id: 3, value: "9:16", label: "Portrait (9:16)", style: "w-4 h-6" },
        {
          id: 3,
          value: "9:16-P",
          label: "Center Align (9:16)",
          style: "w-4 h-6",
        },
        { id: 4, value: "4:3", label: "Square (1:1)", style: "w-4 h-4" },
      ],
    },
  ];

  const handleTrimming = () => {
    handleTrim();
    handleResetAspectRatio();
  };

  const handleAspectRatioChange = (value: any) => {
    setSelectedAspectRatio(value);
    handleResize(value, trimmedVideoFile || "");
  };

  const handleResetAspectRatio = () => {
    setResetKey((prevKey) => prevKey + 1);
    setSelectedAspectRatio(undefined); //rest aspect ratio
  };

  const handleResetAll = () => {
    setTrimmedVideoFile(null);
    handleResetAspectRatio();
  };

  const linkedInPreviewRef = useRef<any>(null);

  const handleLinkedInPreviewClick = async () => {
    // setState((prev: any) => ({
    //   ...prev,
    //   isSelected: false,
    // }));
    try {
      // Generate AI caption
      setGeneratingAiCaption(true);
      const data = {
        content: metadata.description + "\n" + metadata.tags,
        type: "video",
      };
      const captionResponse: any = await fetchAiCaption(data);
      const caption = captionResponse?.data?.data?.caption || "";
      console.log("🚀 ~ handleLinkedInPreviewClick ~ caption:", caption);
      setPostText(caption);
    } catch (error) {
    } finally {
      setGeneratingAiCaption(false);
    }

    try {
      if (linkedInPreviewRef.current) {
        linkedInPreviewRef?.current?.handlePostClick();
      }
    } catch (error) {}
  };

  return (
    <main className="App flex gap-5 flex-col-reverse lg:flex-row min-h-[85vh] overflow-hidden mt-8">
      <div
        className="absolute top-1 z-40 text-xs  text-brand-primary cursor-pointer hover:text-brand-secondary hover:bg-slate-200 p-1 rounded-md"
        onClick={handleGotoVideos}>
        <div className="flex gap-1 items-center">
          <MoveLeft className="w-4" />
          Videos
        </div>
      </div>
      <div className="w-full lg:w-[30%] bg-slate-100 rounded-md p-2 relative h-full overflow-auto my-2">
        <h3 className="font-semibold text-base text-center py-3">
          Edit meta data & Subtitle
        </h3>
        <div className="w-full space-y-2">
          <div className="w-full">
            <h2 className="text-sm font-bold text-gray-800">Title</h2>
            <TodaiInput
              name="title"
              value={metadata.title}
              onChange={handlevideoMetaDataChange}
              className="border p-2 rounded w-full"
              placeholder="Enter text"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Description</h2>
            <textarea
              rows={showSubtitle ? 4 : 3}
              name="description"
              value={metadata.description}
              //onChange={handlevideoMetaDataChange}
              className="border p-2 rounded w-full"
              placeholder="Enter text"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Tags</h2>
            <textarea
              rows={showSubtitle ? 2 : 3}
              name="tags"
              value={metadata.tags}
              // onChange={handlevideoMetaDataChange}
              className="border p-2 rounded w-full"
              placeholder="Enter text"
            />
          </div>
          {showSubtitle && (
            <SubtitleEditor
              inputVideo={inputVideo}
              setInputVideo={setInputVideo}
            />
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center flex-col bg-slate-100 p-2 rounded-md relative">
        {inputVideo.videoUrl && (
          <div className="rounded-md">
            <video
              className="rounded-md h-[200px] xl:h-[500px] shadow-lg"
              src={
                trimmedVideoFile != null
                  ? trimmedVideoFile
                  : inputVideo.videoUrl
              }
              controls
              autoPlay
              controlsList="nodownload nofullscreen"
              onError={() =>
                console.error(
                  "Failed to load video. The URL might be invalid or the server doesn't allow video playback."
                )
              }></video>
            <div className="float-right mt-2 p-2">
              <TodaiTooltip
                triggerContent={
                  <IconRestore
                    className="text-slate-500 cursor-pointer w-5 h-5 hover:shadow-md rounded-md"
                    onClick={handleResetAll}
                  />
                }
                tooltipContent={"Reset"}
              />
            </div>
          </div>
        )}
        {videoMeta && (
          <SeekBar
            rEnd={rEnd}
            rStart={rStart}
            handleUpdaterStart={(e: any) => setRstart(Number(e.target.value))}
            handleUpdaterEnd={(e: any) => setRend(Number(e.target.value))}
            loading={thumbnailIsProcessing}
            videoMeta={videoMeta}
            control={
              <div className="flex flex-wrap gap-2 my-1">
                <TodaiButton
                  type="button"
                  variant="primary-outline"
                  onClick={handleTrimming}
                  className="!text-black text-xs text-nowrap"
                  disabled={trimIsProcessing}>
                  <div className="flex gap-1 items-center justify-center ">
                    <Scissors className="h-5 w-5 opacity-40" />
                    {trimIsProcessing ? "Trimming..." : "Trim Selected"}
                  </div>
                </TodaiButton>
                {!showSubtitle && (
                  <div>
                    <TodaiSelect
                      placeholder="Aspect Ratio"
                      groups={aspectRatios}
                      value={selectedAspectRatio}
                      onChange={handleAspectRatioChange}
                      resetKey={resetKey}
                    />
                  </div>
                )}
                <div className="flex gap-2 h-10 ml-10">
                  <TodaiButton
                    type="button"
                    variant="primary-outline"
                    onClick={() =>
                      helpers.download(
                        trimmedVideoFile != null
                          ? trimmedVideoFile
                          : inputVideo.videoUrl
                      )
                    }
                    className="!text-black text-xs px-10"
                    disabled={trimIsProcessing}>
                    <div className="flex gap-1 items-center justify-center">
                      <Download className="h-5 w-5 opacity-40" />
                      Export
                    </div>
                  </TodaiButton>
                  <TodaiAnimatedButton
                    variant="primary"
                    loading={trimIsProcessing || generatingAiCaption}
                    onClick={handleLinkedInPreviewClick}
                    disabled={trimIsProcessing}
                    className="!px-8 rounded-3xl text-white">
                    <div className="flex gap-2 text-center text-xs items-center  justify-center">
                      <SendIcon className="w-4 h-4" />
                      Post
                    </div>
                  </TodaiAnimatedButton>
                </div>
              </div>
            }
            thumbNails={thumbNails}
          />
        )}

        {aspectLoading && (
          <div className="absolute top-0 bottom-0 right-0 left-0 bg-black bg-opacity-40 rounded-md z-[51]">
            <div className="absolute left-1/2 top-1/2 -mt-8 right-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-50">
              <div className="flex items-center flex-col">
                <Loader className="animate-spin" />{" "}
                <p className="text-xs">Processing...</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* {error && <div className="error-message">{error}</div>} */}
      <LinkedInPreview
        ref={linkedInPreviewRef}
        imgUrl={trimmedVideoFile || inputVideo.videoUrl}
        postText={postText}
        setPostText={setPostText}
      />
    </main>
  );
};

export default VideoTrimmer;

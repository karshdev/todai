"use client";
import { useToast } from "@/components/ui/use-toast";
import UploadVideoDropZone from "@/components/video/UploadVideoDropZone";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useVideoState } from "@/hooks/video/useVideoState";
import { fetchVideoDetails } from "@/lib/axios/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import VideoList from "./components/videoList";
import VideoTrimmer from "./videoTrimmer/videoTrimmer";

function VideoUpload() {
  const [videoFile, setVideoFile] = useState<File | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { editVideo, setEditVideo } = useVideoState();
  const [videoId, setVideoId] = useState<number | null>(null);
  const { toast } = useToast();
  const [vid, setvid] = useLocalStorage("vid", "");
  const queryClient = useQueryClient();

  // const createVideoMutation = useMutation({
  //   mutationFn: (fileInput: File) => uploadVideo(fileInput),
  //   onSuccess: (response: any) => {
  //     const videoData = response?.data?.data;
  //     setVideoId(videoData.video_id);
  //     setvid(videoData.video_id);
  //     queryClient.setQueryData(["videoDetails", videoData.video_id], videoData);
  //   },
  //   onError: () => {
  //     setLoading(false);
  //     toast({
  //       variant: "destructive",
  //       title: "Something went wrong!",
  //       description: "Please try again",
  //     });
  //   },
  // });

  const { data, isLoading } = useQuery({
    queryKey: ["videoDetails", Number(vid)],
    queryFn: ({ queryKey }) => fetchVideoDetails(queryKey[1] as number),
    enabled: !!videoId,
    refetchInterval: (query: any) => {
      const data = query.state.data?.data?.data;
      if (!data) return 5000; // If no data yet, continue polling
      if (data.clips.length > 0 && !data.is_processing) {
        setLoading(false);
        return false; // stop polling
      }
      setLoading(true);
      return 5000;
    },
    select: (response: any) => response.data.data,
  });

  // const onDrop = useCallback((acceptedFiles: File[]) => {
  //   const video = acceptedFiles.filter((file: File) =>
  //     file.type.startsWith("video/")
  //   );
  //   if (video.length > 0) {
  //     setvid("");
  //     setVideoId(null);
  //     setEditVideo({ videoId: 0, videoUrl: "" });
  //     setLoading(true);
  //     setVideoFile(video[0]);
  //     createVideoMutation.mutate(video[0]);
  //   } else {
  //     toast({
  //       variant: "destructive",
  //       title: "Upload failed!",
  //       description: "Please select video files only.",
  //     });
  //     console.error("Please select video files only.");
  //   }
  // }, []);

  // const {
  //   getRootProps,
  //   getInputProps,
  //   isDragActive,
  //   isDragAccept,
  //   isDragReject,
  // } = useDropzone({
  //   onDrop,
  //   accept: {
  //     "video/*": [],
  //   },
  //   multiple: false, // Allow multiple videos
  // });

  return (
    <div className="container flex flex-col h-[50%] relative">
      {editVideo.videoUrl === "" ? (
        <>
          {/* Header Section */}
          <header className="flex flex-col items-center mt-3">
            <p className="text-xs text-slate-500">Create</p>
            <h1 className="text-3xl font-bold">Magic Video</h1>
            <div className="mt-2 text-sm max-w-4xl text-center text-slate-500">
              <p>
                Please upload your video or you can download a video from
                youtube and upload here using a tool such as{" "}
                <span className="text-blue-400 hover:text-blue-600">
                  <a href="https://yt1d.com/en12/" target="_blank">
                    Free YouTube Video Downloader Online (1080p) - YT1D
                  </a>
                </span>{" "}
                - please note if you are using third party videos or download
                tools that you are responsible for following their terms and
                conditions and copy write rules. Please check the terms of use
                of any third party sites such as Youtube, todai is not
                responsible for any infringements as a result of your use of
                these third party platforms.
              </p>
            </div>
          </header>

          {/* Drag-and-Drop Section */}
          <UploadVideoDropZone
            setvid={setvid}
            setVideoFile={setVideoFile}
            setVideoId={setVideoId}
            setEditVideo={setEditVideo}
            setLoading={setLoading}
          />
          <VideoList
            data={data}
            isProcessing={loading}
            setEditVideo={setEditVideo}
          />
        </>
      ) : (
        <VideoTrimmer inputVideo={editVideo} setInputVideo={setEditVideo} />
      )}
    </div>
  );
}

export default VideoUpload;

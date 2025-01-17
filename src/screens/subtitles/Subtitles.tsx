"use client";
import { useToast } from "@/components/ui/use-toast";
import UploadVideoDropZone from "@/components/video/UploadVideoDropZone";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useVideoState } from "@/hooks/video/useVideoState";
import { fetchVideoDetails } from "@/lib/axios/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import VideoList from "../videos/components/videoList";
import VideoTrimmer from "../videos/videoTrimmer/videoTrimmer";

function Subtitles() {
  const [videoFile, setVideoFile] = useState<File | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { editVideo, setEditVideo } = useVideoState();
  const [videoId, setVideoId] = useState<number | null>(null);
  const { toast } = useToast();
  const [vid, setvid] = useLocalStorage("sub_vid", "");
  const queryClient = useQueryClient();

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

  return (
    <div className="flex flex-col h-[50%] md:h-full w-full relative">
      {editVideo.videoUrl === "" ? (
        <>
          <header className="flex flex-col items-center mt-3">
            <p className="text-xs text-slate-500">Create</p>
            <h1 className="text-3xl font-bold">Subtitles</h1>
          </header>
          <UploadVideoDropZone
            createClips={false}
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
        <VideoTrimmer inputVideo={editVideo} setInputVideo={setEditVideo} showSubtitle />
      )}
    </div>
  );
}

export default Subtitles;

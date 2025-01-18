import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "../ui/use-toast";
import TodaiIcon from "../icon/TodaiIcon";
import { IconDragDrop } from "@tabler/icons-react";
import { uploadVideoProgress } from "@/lib/axios/api";

type UploadVideoDropZoneProps = {
  setVideoId: React.Dispatch<React.SetStateAction<number | null>>;
  setvid: React.Dispatch<React.SetStateAction<string>>;
  setVideoFile: React.Dispatch<React.SetStateAction<File | string>>;
  setEditVideo: React.Dispatch<
    React.SetStateAction<{
      videoId: number;
      videoUrl: string;
    }>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createClips?: boolean;
};

function UploadVideoDropZone({
  setVideoId,
  setvid,
  setVideoFile,
  setEditVideo,
  setLoading,
  createClips = true,
}: UploadVideoDropZoneProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadVideoWithProgress = async (file: File) => {
    const response = await uploadVideoProgress(
      file,
      setUploadProgress,
      createClips
    );

    return response;
  };

  const createVideoMutation = useMutation({
    mutationFn: uploadVideoWithProgress,
    onSuccess: (response: any) => {
      const videoData = response?.data?.data;
      setVideoId(videoData.video_id);
      setvid(videoData.video_id);
      queryClient.setQueryData(["videoDetails", videoData.video_id], videoData);
      setUploadProgress(0);
    },
    onError: (error: any) => {
      console.log("error:", error);
      setLoading(false);
      setUploadProgress(0);
      toast({
        variant: "destructive",
        title: error?.response?.data?.status || "Something went wrong!",
        description: error?.response?.data?.message || "Please try again",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const video = acceptedFiles.filter((file: File) =>
      file.type.startsWith("video/")
    );
    if (video.length > 0) {
      setvid("");
      setVideoId(null);
      setEditVideo({ videoId: 0, videoUrl: "" });
      setLoading(true);
      setVideoFile(video[0]);
      createVideoMutation.mutate(video[0]);
    } else {
      toast({
        variant: "destructive",
        title: "Upload failed!",
        description: "Please select video files only.",
      });
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "video/*": [],
    },
    multiple: false,
  });

  return (
    <div className="flex-grow flex justify-center items-center mt-5">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full max-w-lg p-6 border-2 border-dashed rounded-lg shadow-lg
          ${
            isDragActive && isDragAccept
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-gray-100"
          }
          ${
            isDragActive && isDragReject
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-100"
          }
          transition-all cursor-pointer`}>
        <input {...getInputProps()} />
        <TodaiIcon height={50} width={50}>
          <IconDragDrop />
        </TodaiIcon>
        <p className="mt-4 text-gray-700">
          {isDragActive
            ? "Drop the video files here..."
            : "Drag & drop videos here, or click to browse"}
        </p>
        {uploadProgress > 0 && (
          <div className="w-full mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}
        <small className="mt-2 text-gray-500">
          Only video files are allowed.
        </small>
      </div>
    </div>
  );
}

export default UploadVideoDropZone;

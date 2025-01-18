import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "../ui/use-toast";
import TodaiIcon from "../icon/TodaiIcon";
import { IconDragDrop } from "@tabler/icons-react";
import { fetchCaptionAndHashtags, uploadResources } from "@/lib/axios/api";
import TodaiCircularLoader from "../loader/TodaiCircularLoader";

type UploadImageDropZoneProps = {
  setImageFile: React.Dispatch<React.SetStateAction<File | string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setImageData: React.Dispatch<React.SetStateAction<{post: string, imageUrl: string, imageId: number}>>;
  loading: boolean;
};

function UploadImageDropZone({
  setImageFile,
  setLoading,
  loading,
  setImageData,
  setShowPreview
}: UploadImageDropZoneProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getImageCaption = async (file: File) => {
    const response = await fetchCaptionAndHashtags(file);
    return response;
  };
  const uploadImage = async (file: File) => {
    const response = await uploadResources(file);
    return response;
  };

  const createImageMutation = useMutation({
    mutationFn: getImageCaption,
    onSuccess: (response: any) => {
      console.log(response, "Imag caption response");
      const imageData = response?.data?.data;
      console.log(imageData);
      setImageData((prev)=> ({...prev, post: imageData}));
      setShowPreview(true);
      // queryClient.setQueryData(["imageDetails", imageData.image_id], imageData)
    },
    onError: (error: any) => {
      console.log("error:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: error?.response?.data?.status || "Something went wrong!",
        description: error?.response?.data?.message || "Please try again",
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (response: any) => {
      console.log(response, "Imag caption response");
      const imageData = response?.data?.data;
      console.log(imageData);
      setImageData((prev)=> ({...prev, imageUrl: imageData.url, imageId: imageData.id}));
      // queryClient.setQueryData(["imageDetails", imageData.image_id], imageData)
    },
    onError: (error: any) => {
      console.log("error:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: error?.response?.data?.status || "Something went wrong!",
        description: error?.response?.data?.message || "Please try again",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const images = acceptedFiles.filter((file: File) =>
      file.type.startsWith("image/")
    );
    if (images.length > 0) {
      setLoading(true);
      setImageFile(images[0]);
      uploadImageMutation.mutate(images[0]);
      createImageMutation.mutate(images[0]);
    } else {
      toast({
        variant: "destructive",
        title: "Upload failed!",
        description: "Please select image files only.",
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
      "image/*": [],
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
          transition-all cursor-pointer`}
      >
        <input {...getInputProps()} />
        <TodaiIcon height={50} width={50}>
          <IconDragDrop />
        </TodaiIcon>
        <p className="mt-4 text-gray-700">
          {isDragActive
            ? "Drop the image files here..."
            : "Drag & drop images here, or click to browse"}
        </p>
        {/* {uploadProgress > 0 && (
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
        )} */}
        {loading && <TodaiCircularLoader height="h-full my-4" />}
        <small className="mt-2 text-gray-500">
          Only image files are allowed.
        </small>
      </div>
    </div>
  );
}

export default UploadImageDropZone;

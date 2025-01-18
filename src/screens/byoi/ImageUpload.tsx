"use client";
import UploadImageDropZone from "@/components/image/UploadImageDropZone";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import EditPost from "../home/components/EditPost";
import TodaiDialog from "@/components/dialog/TodaiDialog";

function ImageUpload() {
  const [imageFile, setImageFile] = useState<File | string>("");
  //   const [imageData, setImageData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageData, setImageData] = useState({
    post: "",
    imageUrl: "",
    imageId: 0,
  });
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!showPreview) {
      setImageData({
        post: "",
        imageUrl: "",
        imageId: 0,
      });
      setLoading(false);
    }
  }, [showPreview]);

  return (
    <div className="container flex flex-col h-[50%] relative">
      {imageData.post === "" ? (
        <>
          {/* Header Section */}
          <header className="flex flex-col items-center mt-3">
            <p className="text-xs text-slate-500">Create</p>
            <h1 className="text-3xl font-bold">Bring Your Own Image</h1>
            <div className="mt-2 text-sm max-w-4xl text-center text-slate-500">
              <p>
                Already got an image you like? Simply upload it here and todai
                will create a caption and hashtags for you, ready to post!
              </p>
            </div>
          </header>

          {/* Drag-and-Drop Section */}
          <UploadImageDropZone
            setImageFile={setImageFile}
            setLoading={setLoading}
            loading={loading}
            setImageData={setImageData}
            setShowPreview={setShowPreview}
          />
        </>
      ) : (
        <TodaiDialog
          open={showPreview}
          setOpen={setShowPreview}
          dialogTitle="BYOI Preview"
          content={
            <div className="w-full h-full overflow-y-auto p-5">
              <EditPost
                text={imageData.post}
                thumbnailUrl={""}
                profileImgUrl={imageData?.imageUrl || ""}
              />
            </div>
          }
          dialogWidth="!w-[98%]"
          //   dialogWidth={`${editText ? "!w-[98%]" : "min-w-[35%] !w-fit "}`}
          extraClass="!p-4 min-h-96 !w-96"
        />
      )}
    </div>
  );
}

export default ImageUpload;

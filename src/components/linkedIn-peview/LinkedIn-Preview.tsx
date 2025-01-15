import { useModal } from "@/hooks/useModal";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import TodaiDialog from "../dialog/TodaiDialog";
import TodaiDropdown from "../dropdown/TodaiPostButtonDropdown";
import LiPreview from "./components/LiPreview";
import { LinkedInPostButtonProps } from "./types/linkedInPreviewTypes";

const LinkedInPreview = forwardRef<
  { handlePostClick: () => void },
  LinkedInPostButtonProps
>(
  (
    {
      postText: initialPostText,
      imgRef,
      setPostText: initialSetPostText,
      imgUrl,
      videoUrl,
      fileInput,
      handleCloseSheet,
      editText = true,
      postButton = true,
      assetLink,
    },
    ref
  ) => {
    const { closeModal } = useModal();
    const [showPreview, setPreView] = useState(false);
    const canvasFile = useRef<File | null>(null);
    const [internalPostText, setInternalPostText] = useState(
      initialPostText || ""
    );
    const fileRef = useRef();
    const postText =
      initialPostText !== undefined ? initialPostText : internalPostText;
    const setPostText =
      initialSetPostText !== undefined
        ? initialSetPostText
        : setInternalPostText;

    const handlePostClick = async () => {
      fileRef.current = imgRef?.current
        ? imgRef?.current.toDataURL({ pixelRatio: 2 })
        : imgUrl || videoUrl;
      setPreView((prev) => !prev);
      if (imgRef?.current) {
        const canvasElement = imgRef?.current?.getStage().toCanvas();
        const dataURL = canvasElement.toDataURL("image/png");
        const blob = await fetch(dataURL).then((res) => res.blob());
        const file = new File([blob], `file-${Date.now()}.png`, {
          type: "image/png",
        });
        canvasFile.current = file;
      }
    };

    useImperativeHandle(ref, () => ({
      handlePostClick,
    }));

    const closeAllModal = () => {
      // handleCloseSheet
      closeModal("editSheet");
      setPreView(false);
    };
    return (
      <>
        {showPreview && (
          <TodaiDialog
            open={showPreview}
            setOpen={setPreView}
            dialogTitle="LinkedIn Preview"
            content={
              <div className="w-full h-full p-5">
                <LiPreview
                  postText={postText}
                  imgUrl={fileRef.current || assetLink}
                  setPostText={setPostText}
                  editText={editText}
                />
              </div>
            }
            dialogWidth={`${editText ? "!w-[98%]" : "min-w-[35%] !w-fit "}`}
            extraClass="!p-4 min-h-96 !w-96"
            footerContent={
              postButton && (
                <div className="float-end flex gap-3">
                  <TodaiDropdown
                    content={postText}
                    asset={fileRef.current}
                    fileInput={canvasFile}
                    closeAllModal={closeAllModal}
                  />
                </div>
              )
            }
          />
        )}
      </>
    );
  }
);

LinkedInPreview.displayName = "LinkedInPreviewButton";

export default LinkedInPreview;

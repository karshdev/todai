import authorImage from "@/assets/img/avatar-dummy.jpeg";
import TodaiAvatar from "@/components/avatar/TodaiAvatar";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import { TodaiImage } from "@/components/TodaiImage";
import TodaiInput from "@/components/TodaiInput";
import { useProfile } from "@/hooks/useProfile";
import React, { useState, useEffect, useRef } from "react";
import { LinkedInPostButtonProps } from "../types/linkedInPreviewTypes";
import UniversalPDFViewer from "@/components/pdf/PdfViewer";
import { getFileTypeFromUrl } from "@/lib/utils";
import LinkedInPreviewFooter from "./LinkedInPreviewFooter";

const LiPreview: React.FC<LinkedInPostButtonProps> = ({
  postText: initialPostText,
  imgUrl,
  setPostText,
  fileInput,
  editText,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpand, setShowExpand] = useState(false);
  const [internalPostText, setInternalPostText] = useState(
    initialPostText || ""
  );
  const textRef = useRef<HTMLDivElement>(null);

  const { data: profileInfo } = useProfile();

  useEffect(() => {
    const checkTextOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;
        // Check if text exceeds 3 lines
        const lineHeight = parseInt(
          window.getComputedStyle(element).lineHeight
        );
        const maxHeight = lineHeight * 3;

        setShowExpand(element.scrollHeight > maxHeight);
      }
    };

    checkTextOverflow();
    // Recheck on window resize
    window.addEventListener("resize", checkTextOverflow);
    return () => window.removeEventListener("resize", checkTextOverflow);
  }, [initialPostText, internalPostText]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const maxCharacterLimit = 3000;

  const handleInputChange = (e: any) => {
    const newText = e.target.value;
    if (newText.length <= maxCharacterLimit) {
      if (setPostText) {
        setPostText(newText);
      } else {
        setInternalPostText(newText);
      }
    } else {
      alert(
        `You have reached the maximum character limit of ${maxCharacterLimit}.`
      );
    }
  };

  const displayedText = initialPostText ? initialPostText : internalPostText;
  const characterCount = displayedText?.length || 0;

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start overflow-y-auto h-full rounded-xl pb-8 px-1 min-w-full">
      {/* Left Section - Text Input */}
      {editText && (
        <div className="flex-1 flex flex-col max-h-full">
          <TodaiInput
            type="textarea"
            rows={22}
            inputClass="border w-full flex-grow rounded-2xl"
            value={displayedText}
            onChange={handleInputChange}
            maxLength={maxCharacterLimit}
          />
          <p className="text-xs text-slate-500 ml-3 pt-1">
            Character count: {characterCount} / {maxCharacterLimit}
          </p>
        </div>
      )}

      {/* Right Section - Post Content */}
      <div className="flex-1 max-w-xl h-fit bg-white border border-gray-300 rounded-2xl shadow-xl">
        {/* Profile and Summary Section */}
        <div className="flex items-center px-4 py-4">
          <TodaiAvatar authorImage={profileInfo?.image || authorImage} />
          <div className="ml-4">
            <div className="text-sm font-semibold text-black">
              {profileInfo?.first_name} {profileInfo?.last_name}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-normal text-gray-500">Now</span>
              <span className="text-xs font-normal text-gray-500">•</span>
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 text-gray-500">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Summary Text with See More / See Less */}
        {displayedText || displayedText === "" ? (
          <div className="mb-4 text-sm px-4 relative">
            <div
              ref={textRef}
              className={`whitespace-pre-wrap break-words text-black ${
                isExpanded ? "line-clamp-none" : "line-clamp-3"
              }`}>
              {displayedText}
            </div>

            {showExpand && (
              <div
                className="bg-white text-gray-400 cursor-pointer text-xs absolute bottom-0 right-4 pl-5"
                onClick={toggleExpansion}>
                {isExpanded ? "See less" : "...See more"}
              </div>
            )}
          </div>
        ) : (
          <TodaiCircularLoader height="h-60" />
        )}

        {/* Image Rendering (unchanged from previous version) */}
        {imgUrl && getFileTypeFromUrl(imgUrl) === "image" && (
          <div className="relative">
            <TodaiImage
              src={imgUrl}
              alt="Post Image"
              width={400}
              height={400}
              className="w-full !h-80 object-cover"
            />
          </div>
        )}
        {imgUrl && getFileTypeFromUrl(imgUrl) === "pdf" && (
          <div className="relative">
            <UniversalPDFViewer file={imgUrl} />
          </div>
        )}
        {imgUrl && getFileTypeFromUrl(imgUrl) === "video" && (
          <div className="relative">
            <video controls className="w-full !h-80 object-cover">
              <source src={imgUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <LinkedInPreviewFooter />
      </div>
    </div>
  );
};

export default LiPreview;

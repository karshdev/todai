import TodaiAvatar from "@/components/avatar/TodaiAvatar";
import TodaiDialog from "@/components/dialog/TodaiDialog";
import TodaiDropdown from "@/components/dropdown/TodaiPostButtonDropdown";
import LinkedInPreviewFooter from "@/components/linkedIn-peview/components/LinkedInPreviewFooter";
import LinkedInSocialIcon from "@/components/linkedIn-peview/LinkedInSocialIcon";
import UniversalPDFViewer from "@/components/pdf/PdfViewer";
import TodaiInput from "@/components/TodaiInput";
import React, { useState } from "react";

type CarouselPreviewProps = {
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  profileInfo: any;
  pdfBlobUrl: any;
  avatar: any;
  pdfBase64: any;
  postText: any;
  setPostText: any;
};
function CarouselPreview({
  showPreview,
  setShowPreview,
  profileInfo,
  pdfBlobUrl,
  avatar,
  pdfBase64,
  postText,
  setPostText,
}: CarouselPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  //   const [postText, setPostText] = useState("");
  const maxCharacterLimit = 3000;

  const handleInputChange = (e: any) => {
    const newText = e.target.value;
    if (newText.length <= maxCharacterLimit) {
      setPostText(newText);
    } else {
      alert(
        `You have reached the maximum character limit of ${maxCharacterLimit}.`
      );
    }
  };
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  const enterCount = (postText?.match(/\n/g) || []).length;
  const characterCount = postText?.length || 0;
  return (
    <TodaiDialog
      open={showPreview}
      setOpen={setShowPreview}
      dialogTitle="LinkedIn Preview"
      content={
        <div className="flex flex-col lg:flex-row gap-5 xl:gap-14 h-full p-5">
          <div className="flex-0 lg:flex-1 flex flex-col max-h-full">
            <TodaiInput
              type="textarea"
              rows={22}
              inputClass="border w-full flex-grow rounded-2xl"
              value={postText}
              onChange={handleInputChange}
              maxLength={maxCharacterLimit}
            />
            {/* <TodaiInput type="textarea" rows={22} inputClass="border w-full flex-grow rounded-2xl"
                    value={postText}
                    onChange={handleInputChange}
                    maxLength={maxCharacterLimit}
                /> */}
            <p className="text-xs text-slate-500 ml-3 pt-1">
              {" "}
              Character count: {characterCount} / {maxCharacterLimit}
            </p>
          </div>
          <div className=" min-w-xl flex-1 overflow-y-auto h-full ">
            <div className="flex-1 max-w-xl bg-white border border-gray-300 rounded-2xl shadow-xl">
              {/* Profile and Summary Section */}
              <div className="flex items-center px-4 py-4">
                <TodaiAvatar authorImage={profileInfo?.image || avatar} />
                <div className="ml-4">
                  <div className="text-sm font-semibold">
                    {profileInfo?.first_name} {profileInfo?.last_name}
                  </div>
                  <div className="text-xs text-gray-500">2 d •</div>
                </div>
              </div>
              <div className=" text-sm px-4 relative">
                <div
                  className={
                    isExpanded
                      ? "line-clamp-none whitespace-pre-wrap break-words text-black"
                      : "whitespace-pre-wrap break-words line-clamp-3 text-black"
                  }>
                  {postText}
                </div>
                <div
                  className={`bg-white text-gray-400 cursor-pointer text-xs float-end absolute bottom-0 right-4 pl-5 ${
                    isExpanded ? "-bottom-4" : "-mt-4"
                  }`}
                  onClick={toggleExpansion}>
                  {(postText && characterCount > 190) || enterCount > 3
                    ? isExpanded
                      ? "See less"
                      : "...See more"
                    : ""}
                </div>
              </div>

              <UniversalPDFViewer file={pdfBlobUrl.current} />
              {/* Social Section */}
              <LinkedInPreviewFooter />
            </div>
          </div>
        </div>
      }
      dialogWidth="min-w-1/3 w-2/3" // Adjusted Tailwind classes
      extraClass="!p-4 min-h-96 w-full" // Adjusted Tailwind classes
      footerContent={
        <div className="float-end flex gap-3">
          <TodaiDropdown
            content={postText}
            fileInput={pdfBase64}
            closeAllModal={() => setShowPreview(!showPreview)}
          />
        </div>
      }
    />
  );
}

export default CarouselPreview;

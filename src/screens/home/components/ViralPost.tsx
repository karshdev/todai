import { TodaiImage } from "@/components/TodaiImage";
import { Send, WandSparkles } from "lucide-react";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import TodaiAvatar from "@/components/avatar/TodaiAvatar";
import LinkedInPreview from "@/components/linkedIn-peview/LinkedIn-Preview";

type PropEditPost = {
  content: string;
  thumbnailUrl: string;
  profileUrl: string;
};
type ViralPostProp = {
  thumbnail: any;
  authorImage?: any;
  title?: string;
  content: string;
  editFunction: ({ content, thumbnailUrl, profileUrl }: PropEditPost) => void;
  handleCloseSheet?: any;
};

function ViralPost({
  thumbnail,
  authorImage,
  title,
  content,
  editFunction,
  handleCloseSheet,
}: ViralPostProp) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  //   const getDisplayContent = () => {
  //     if (isExpanded) {
  //       return content.replace(/\n/g, "<br />");
  //     } else {
  //       const limitedContent = content.slice(0, 400).replace(/\n/g, "<br />");
  //       return `${limitedContent}${content.length > 400 ? "..." : ""}`;
  //     }
  //   };

  const getDisplayContent = () => {
    if (isExpanded) {
      return content;
    } else {
      const limitedContent = content.slice(0, 400);
      return `${limitedContent}${content.length > 400 ? "..." : ""}`;
    }
  };

  const linkedInPreviewRef = useRef<any>(null);

  const handleLinkedInPreviewClick = () => {
    if (linkedInPreviewRef.current) {
      linkedInPreviewRef?.current?.handlePostClick();
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col p-6 mb-2 ">
      <div className="relative">
        {thumbnail && (
          <TodaiImage
            src={thumbnail}
            alt="Thumbnail"
            className="w-full h-48 object-cover rounded-2xl"
            width={500}
            height={500}
          />
        )}
        {/* {authorImage && <TodaiImage src={authorImage} alt="Author" className="absolute -top-4 -left-2 w-12 h-12 object-cover rounded-full border-2 border-white" width={500} height={500} />} */}
        {authorImage && (
          <TodaiAvatar
            authorImage={authorImage}
            extraClass={"absolute -top-4 -left-2"}
          />
        )}
      </div>
      <div className={`py-2 flex-grow ${thumbnail ? "" : "mt-8"} h-2/3`}>
        {title && <h4 className="font-semibold my-2">{title}</h4>}
        <motion.div
          style={{ overflow: "hidden" }}
          initial={false}
          animate={{
            height: isExpanded ? "auto" : "10.10rem",
            opacity: isExpanded ? 1 : 0.8,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-gray-700 text-sm mb-2">
          <div
            dangerouslySetInnerHTML={{ __html: getDisplayContent() }}
            style={{ whiteSpace: "pre-wrap" }}
          />
        </motion.div>
        {content.length > 400 ? (
          <button
            className="text-blue-500 text-opacity-90 text-xs font-semibold float-right"
            onClick={toggleReadMore}>
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        ) : (
          <div className="h-4 w-full"></div>
        )}
      </div>
      <div className=" flex justify-end items-center mt-5">
        {/* <button
          className="flex gap-2 items-center text-blue-500 font-semibold text-xs"
          onClick={() =>
            editFunction({
              content,
              thumbnailUrl: thumbnail,
              profileUrl: authorImage,
            })
          }>
          <WandSparkles className="text-slate-300 w-4 h-4" /> Edit
        </button> */}

        {/* <TodaiAnimatedButton
          variant="primary"
          onClick={handleLinkedInPreviewClick}
          className="!w-fit !px-6 !rounded-3xl !text-brand-primary border bg-transparent hover:!text-white">
          <div className="flex gap-2 text-center text-xs items-center  justify-center">
            <Send className="w-4 h-4" />
            Post
          </div>
        </TodaiAnimatedButton> */}
        <TodaiAnimatedButton
          variant="primary"
          onClick={() =>
            editFunction({
              content,
              thumbnailUrl: thumbnail,
              profileUrl: authorImage,
            })
          }
          className="!w-fit !px-6 !rounded-3xl !text-brand-primary border bg-transparent hover:!text-white">
          <div className="flex gap-2 text-center text-xs items-center  justify-center">
            <WandSparkles className="text-slate-300 w-4 h-4" />
            Edit & Post
            {/* <Send className="w-4 h-4" /> */}
          </div>
        </TodaiAnimatedButton>
      </div>
      <LinkedInPreview
        ref={linkedInPreviewRef}
        imgUrl={thumbnail}
        postText={content}
        handleCloseSheet={handleCloseSheet}
        editText={false}
        // setPostText={setPostText}
      />
    </div>
  );
}

export default ViralPost;

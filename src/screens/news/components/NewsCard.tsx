import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, WandSparkles } from "lucide-react";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import LinkedInPreview from "@/components/linkedIn-peview/LinkedIn-Preview";

interface NewsCardComponentProps {
  content: string;
  url: string;
  editFunction: (content: string) => void;
  handleCloseSheet: () => void;
}

const NewsCardComponent: React.FC<NewsCardComponentProps> = ({
  content,
  url,
  editFunction,
  handleCloseSheet,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-700" style="padding-top: 10px;">${url}</a>`
    );
  };

  const getDisplayContent = () => {
    const processedContent = renderTextWithLinks(content);
    if (isExpanded) {
      return processedContent;
    } else {
      const limitedContent = processedContent.slice(0, 300);
      return `${limitedContent}${content.length > 300 ? "..." : ""}`;
    }
  };

  const linkedInPreviewRef = useRef<any>(null);

  const handleLinkedInPreviewClick = () => {
    if (linkedInPreviewRef.current) {
      linkedInPreviewRef?.current?.handlePostClick();
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col p-6 min-h-60 lg:min-h-80">
      <div className={`py-2 flex-grow`}>
        <motion.div
          style={{ overflow: "hidden" }}
          initial={false}
          animate={{
            height: isExpanded ? "auto" : "8.80rem",
            opacity: isExpanded ? 1 : 0.8,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-gray-700 text-sm mb-2">
          <div dangerouslySetInnerHTML={{ __html: getDisplayContent() }} />
        </motion.div>
        {content.length > 300 && (
          <button
            className="text-blue-500 text-opacity-90 text-xs font-semibold float-right"
            onClick={toggleReadMore}>
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
      <div className=" gap-3 flex justify-end items-center mt-5">
        {/* <button className="flex gap-2 items-center text-blue-500 font-semibold text-xs" onClick={() => editFunction(content)}>
                    <WandSparkles className="text-slate-300 w-4 h-4" /> Edit
                </button>
                <TodaiAnimatedButton type='button' variant='primary' className='!w-fit !px-6 !rounded-3xl !text-brand-primary border bg-transparent hover:!text-white'
                    onClick={handleLinkedInPreviewClick}>
                    <div className='flex gap-1 text-center text-xs items-center  justify-center'>
                        Post <Send className='opacity-35 w-4 h-4' />
                    </div>
                </TodaiAnimatedButton> */}
        <TodaiAnimatedButton
          type="button"
          variant="primary"
          className="!w-fit !px-6 !rounded-3xl !text-brand-primary border bg-transparent hover:!text-white"
          onClick={() => editFunction(content)}>
          <div className="flex gap-1 text-center text-xs items-center  justify-center">
            <WandSparkles className="text-slate-300 w-4 h-4" /> Edit & Post
          </div>
        </TodaiAnimatedButton>
        <LinkedInPreview
          ref={linkedInPreviewRef}
          // imgUrl={thumbnail}
          postText={content}
          handleCloseSheet={handleCloseSheet}
          editText={false}
          // setPostText={setPostText}
        />
      </div>
    </div>
  );
};

export default NewsCardComponent;

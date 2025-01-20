import { TodaiImage } from "@/components/TodaiImage";
import TodaiInput from "@/components/TodaiInput";
import TodaiDialog from "@/components/dialog/TodaiDialog";
import TodaiDropdown from "@/components/dropdown/TodaiPostButtonDropdown";
import LiPreview from "@/components/linkedIn-peview/components/LiPreview";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import { useEditPost } from "@/hooks/useEditPost";
import { useModal } from "@/hooks/useModal";
import { rewriteWithAI } from "@/lib/axios/api";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import PostEditToolbar from "./PostEditToolbar";
import { ReviseLinkedInPost } from "./ReviseLinkedInPost";
import StockImageList from "@/screens/quotes/components/StockImageList";
import { X } from "lucide-react";
// import PostButton from '@/components/button/PostButton';

type EditPostProps = {
  text: string;
  profileImgUrl: string;
  thumbnailUrl: string;
  handleCloseSheet?: () => void;
};
function EditPost({
  text,
  profileImgUrl,
  thumbnailUrl,
  handleCloseSheet,
}: EditPostProps) {
  const {
    postText,
    selectedGif,
    hashtags,
    isLoading,
    textareaRef,
    pickerType,
    pickerRef,
    fileInputRef,
    fileInput,
    handlePickerToggle,
    handleGifSelect,
    handleEmojiSelect,
    handleTextChange,
    handleImageUpload,
    generateHashtagsClick,
    generateImageClick,
    handleHashtagClick,
    removingHashtag,
    setPostText,
    showStockImage,
    handleImageSelect,
    toggleStockImage
  } = useEditPost(text);
  const { closeModal } = useModal();
  const isPickerOpen = pickerType !== null;
  const [aiRewrite, setAiRewrite] = useState({ show: false, content: "" });

  const handleAiRewriteClick = () => {
    setAiRewrite &&
      setAiRewrite((prev: any) => ({ ...prev, show: !prev.show }));
    mutate(postText);
  };

  const {
    mutate,
    data: aiContent,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (postText: string) => rewriteWithAI(postText),
    onSuccess: (data) => {
      setAiRewrite((prev) => ({ ...prev, content: data.data.data }));
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });

  const linkedInPreviewRef = useRef<any>(null);

  const handleLinkedInPreviewClick = () => {
    if (linkedInPreviewRef.current) {
      linkedInPreviewRef?.current?.handlePostClick();
    }
  };

  const closeAllModal = () => {
    closeModal("editSheet");
  };

  return (
    <div
      key={"index"}
      className="bg-white rounded-xl  flex flex-col p-6 mb-5 flex-grow">
      <TodaiDialog
        open={aiRewrite.show}
        setOpen={setAiRewrite}
        dialogTitle="Rewrite with AI"
        dialogWidth="!w-[80%] lg:!w-[50%]"
        content={
          <ReviseLinkedInPost
            content={postText}
            aiRewrite={aiRewrite}
            setAiRewrite={setAiRewrite}
            pending={isPending}
            mutate={mutate}
            setPostText={setPostText}
          />
        }
        extraClass="!p-4 min-h-96"
      />
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <div className="relative">
            {!isLoading.image ? (
              (thumbnailUrl || selectedGif) && (
                <TodaiImage
                  src={thumbnailUrl || selectedGif!}
                  alt="Thumbnail"
                  className="w-full h-48 object-cover rounded-2xl"
                  width={500}
                  height={500}
                />
              )
            ) : (
              <TodaiCircularLoader height="h-72" />
            )}
            {profileImgUrl && (
              <TodaiImage
                src={profileImgUrl}
                alt="Author"
                className="absolute -top-4 -left-2 w-12 h-12 object-cover rounded-full border-2 border-white"
                width={500}
                height={500}
              />
            )}
          </div>
          <div
            className={` flex-grow ${
              thumbnailUrl == "" ||
              (thumbnailUrl == undefined && selectedGif == null)
                ? "mt-8"
                : "mt-1"
            }`}>
            <TodaiInput
              type="textarea"
              rows={15}
              inputClass="border !rounded-xl"
              value={postText}
              onChange={handleTextChange}
              ref={textareaRef}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <PostEditToolbar
              onGenerateImage={generateImageClick}
              onGenerateHashtags={generateHashtagsClick}
              onEmojiSelect={handleEmojiSelect}
              onGifSelect={handleGifSelect}
              onImageUpload={handleImageUpload}
              isPickerOpen={isPickerOpen}
              pickerType={pickerType}
              tenorApiKey={process.env.NEXT_PUBLIC_TENOR_API_KEY || ""}
              handlePickerToggle={handlePickerToggle}
              pickerRef={pickerRef}
              fileInputRef={fileInputRef}
              handleAiRewriteClick={handleAiRewriteClick}
              toggleStockImage={toggleStockImage}
            />
            {/* <TodaiAnimatedButton className="px-8 py-2 rounded-3xl text-white bg-brand-primary border border-brand-primary hover:bg-white hover:text-brand-primary">
                    Post
                </TodaiAnimatedButton> */}
            {/* <PostButton postText={postText} setPostText={setPostText} image={thumbnailUrl || selectedGif!} /> */}

            {/* <LinkedInPreview
              ref={linkedInPreviewRef}
              fileInput={fileInput}
              imgUrl={thumbnailUrl || selectedGif!}
              postText={postText}
              setPostText={setPostText}
              handleCloseSheet={handleCloseSheet}
            /> */}
            {/* <TodaiAnimatedButton
          variant="primary"
          onClick={handleLinkedInPreviewClick}
          className="float-right w-fit !px-5 rounded-3xl text-white">
          <div className="flex gap-2 text-center text-xs items-center  justify-center">
            <Send className="w-4 h-4" />
            Post
          </div>
        </TodaiAnimatedButton> */}
          </div>
          {hashtags.length > 0 && (
            <div className="mt-5 ">
              <div className="flex flex-col indent-1">
                <h1 className="font-semibold text-lg text-black">#Hashtags</h1>
                <h2 className="text-xs">Select required hashtags</h2>
              </div>
              <div className=" flex flex-wrap  gap-2 py-5">
                <AnimatePresence>
                  {hashtags.map((hashtag) => (
                    <motion.span
                      key={hashtag}
                      initial={{ opacity: 1, x: 0 }}
                      animate={{
                        opacity: removingHashtag === hashtag ? 0 : 1,
                        x: 0,
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        opacity: { duration: 0.5 },
                        x: { duration: 0.5 },
                      }}
                      layout
                      className="bg-slate-100 p-2 rounded-3xl hover:bg-brand-primary text-xs md:text-sm hover:text-white cursor-pointer shadow-md"
                      onClick={() => handleHashtagClick(hashtag)}>
                      {hashtag}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
          {showStockImage && (
            <div className="mt-5 border border-gray-200 rounded-md">
              <X className="ml-auto cursor-pointer" onClick={toggleStockImage} />
              <div className=" flex flex-wrap  gap-2 py-5">
                <StockImageList onImageSelect={handleImageSelect} />
              </div>
            </div>
          )}
          {isLoading.hashtag && hashtags.length == 0 && (
            <div className="mt-5">
              <TodaiCircularLoader />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col items-start lg:-mt-14">
          <p className="text-lg font-semibold text-foreground mt-4 mb-2">
            Post Preview
          </p>
          <LiPreview
            postText={postText}
            fileInput={fileInput}
            imgUrl={thumbnailUrl || selectedGif!}
          />
          <div className="flex justify-end w-full">
            <TodaiDropdown
              content={postText}
              asset={thumbnailUrl || selectedGif!}
              fileInput={fileInput}
              closeAllModal={closeAllModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPost;

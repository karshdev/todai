import { useState, useRef, useEffect, useCallback } from "react";
import { generateHashtags, generatePostImage } from "@/lib/axios/api";
import { urlToFile } from "@/lib/utils/utils";

export const useEditPost = (initialText: string = "") => {
  const [postText, setPostText] = useState(initialText);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [pickerType, setPickerType] = useState<"gif" | "emoji" | null>(null);
  const [isLoading, setIsLoading] = useState({ image: false, hashtag: false });
  const [removingHashtag, setRemovingHashtag] = useState("");
  const [showStockImage, setShowStockImage] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInput = useRef<File | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setPickerType(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePickerToggle = useCallback((type: "gif" | "emoji") => {
    setPickerType((prevType) => (prevType === type ? null : type));
  }, []);

  const handleGifSelect = useCallback(async (gif: { url: string }) => {
    fileInput.current = await urlToFile(gif.url);
    setSelectedGif(gif.url);
    setPickerType(null);
  }, []);

  const toggleStockImage = () => {
    setShowStockImage((prev) => !prev);
  };

  const handleEmojiSelect = useCallback(
    (emojiObject: { emoji: string }) => {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText =
          postText.substring(0, start) +
          emojiObject.emoji +
          postText.substring(end);
        setPostText(newText);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + emojiObject.emoji.length;
          textarea.focus();
        }, 0);
      }
      // setPickerType(null);
    },
    [postText]
  );

  const handleTextChange = useCallback(
    (e: any) => {
      console.log(`handleTextChange----`);
      setPostText(e.target.value);
    },
    [postText]
  );

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        fileInput.current = file;
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedGif(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleImageSelect = useCallback(
    (src: string) => setSelectedGif(src),
    [setSelectedGif]
  );

  const generateHashtagsClick = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, hashtag: true }));
    try {
      const response = await generateHashtags(postText);
      const newHashtags = response?.data?.data;
      if (Array.isArray(newHashtags)) {
        setHashtags((prev: any) => [...prev, ...newHashtags]);
      }
    } catch (error) {
      console.error("Error generating hashtags:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, hashtag: false }));
    }
  }, [postText]);

  const generateImageClick = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, image: true }));
    try {
      const generatedImage = await generatePostImage(postText);
      setSelectedGif(generatedImage.data.data.url);
      fileInput.current = await urlToFile(generatedImage.data.data.url);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, image: false }));
    }
  }, [postText]);

  const handleHashtagClick = useCallback((hashtag: string) => {
    setRemovingHashtag(hashtag);
    setTimeout(() => {
      setPostText((prevText) => {
        const newText = `${prevText} ${hashtag}`;
        if (textareaRef.current) {
          textareaRef.current.value = newText;
          textareaRef.current.scrollTo({
            top: textareaRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
        return newText;
      });
      setHashtags((prevHashtags) =>
        prevHashtags.filter((tag) => tag !== hashtag)
      );
      setRemovingHashtag("");
    }, 500);
  }, []);

  return {
    postText,
    setPostText,
    selectedGif,
    setSelectedGif,
    hashtags,
    pickerType,
    isLoading,
    removingHashtag,
    textareaRef,
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
    showStockImage,
    handleImageSelect,
    toggleStockImage,
  };
};

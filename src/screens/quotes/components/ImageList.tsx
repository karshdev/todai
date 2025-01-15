'use client'
import { TodaiButton } from "@/components/TodaiButton";
import { TodaiImage } from "@/components/TodaiImage";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import { fetchAIImage, fetchStockImage } from "@/lib/axios/api";
import {
  IconBold,
  IconItalic,
  IconPhotoAi,
  IconUnderline,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import SearchImages from "./SearchImages";
import localImages from "./localImages";
import StockImageList from "./StockImageList";
import FontSelector from "./FontSelector";
import FontSizeSelector from "./FontSizeSelector";
import { Button } from "@/components/ui/button";

type ImageListProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onImageSelect: (src: string) => void;
  setImage?: any;
  selectedFont: any;
  handleFontChange?: any;
  state: any;
  setState: any;
  handleFontSizeChange?: any;
  predefinedFontSizes: any;
  fontSizeInputRef: any;
  textStyle: any;
  toggleStyle: any;
};

type StockImage = {
  interest_id: string;
  links: string[];
};

type AIImage = {
  url: string;
};

function ImageList({
  text,
  setText,
  onImageSelect,
  setImage,
  selectedFont,
  handleFontChange,
  state,
  setState,
  handleFontSizeChange,
  predefinedFontSizes,
  fontSizeInputRef,
  textStyle,
  toggleStyle,
}: ImageListProps) {
  // const [stockImages, setStockImages] = useState<StockImage[]>([]);
  const [aiImage, setAiImage] = useState<AIImage>({ url: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: fetchAIImage,
    onSuccess: (data) => {
      setAiImage(data.data.data);
    },
    onError: (error) => {
      console.error("Error fetching AI image:", error);
      alert("Failed to generate AI image. Please try again.");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const getAiImage = () => {
    if (!text.trim()) {
      alert("Please enter some text before generating an AI image.");
      return;
    }
    setIsLoading(true);
    mutation.mutate(text);
  };

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
    [setText]
  );

  return (
    <div className="bg-gray-100 p-4 min-w-80 max-w-md rounded-md h-[800px] overflow-y-auto">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-2 mb-3">
        <div className="px-4 py-2">
          <h2 className="text-sm font-bold text-gray-800">Selected Quote</h2>
        </div>
        <textarea
          rows={3}
          value={text}
          onChange={handleTextChange}
          className="border p-2 rounded w-full mb-2"
          placeholder="Enter text"
        />
        <div className="flex gap-2 flex-wrap items-center">
          <FontSelector
            selectedFont={selectedFont}
            onFontChange={handleFontChange}
          />
          <FontSizeSelector
            fontSize={state.fontSize}
            handleFontSizeChange={handleFontSizeChange}
            showFontSizeList={state.showFontSizeList}
            setShowFontSizeList={(show: boolean) =>
              setState((prev: any) => ({ ...prev, showFontSizeList: show }))
            }
            predefinedFontSizes={predefinedFontSizes}
            fontSizeInputRef={fontSizeInputRef}
          />
          <div className="flex gap-2">
            <Button
              variant={textStyle.bold ? "default" : "outline"}
              size="icon"
              onClick={() => toggleStyle("bold")}
              className="w-8 h-8">
              <IconBold className="h-4 w-4" />
            </Button>
            <Button
              variant={textStyle.italic ? "default" : "outline"}
              size="icon"
              onClick={() => toggleStyle("italic")}
              className="w-8 h-8">
              <IconItalic className="h-4 w-4" />
            </Button>
            <Button
              variant={textStyle.underline ? "default" : "outline"}
              size="icon"
              onClick={() => toggleStyle("underline")}
              className="w-8 h-8">
              <IconUnderline className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* <div className="px-4 py-2">
          <h2 className="text-base font-bold text-gray-800">AI Image</h2>
        </div> */}
        {isLoading ? (
          <div className="w-full h-44 flex items-center justify-center">
            {/* <Skeleton className='w-full h-full' /> */}
            <TodaiCircularLoader height="min-h-full" />
          </div>
        ) : aiImage.url ? (
          <TodaiImage
            className="w-full h-44 object-cover cursor-pointer"
            src={aiImage.url}
            alt="AI Image"
            height={500}
            width={700}
            onClick={() => onImageSelect(aiImage.url)}
          />
        ) : (
          // <div className="w-full h-14 flex items-center justify-center">
          //     <p>No AI image generated yet</p>
          // </div>
          ""
        )}
        {!aiImage.url && (
          <div className="p-2">
            <TodaiButton
              onClick={getAiImage}
              disabled={isLoading}
              className="w-full bg-slate-200 text-slate-500 hover:text-black text-xs py-1 px-4 rounded border">
              <div className="flex items-center justify-center gap-1 ">
                {" "}
                <IconPhotoAi className="h-5 w-5" />{" "}
                {isLoading ? "Generating..." : "Generate AI Image"}
              </div>
            </TodaiButton>
          </div>
        )}
      </div>
      <div className="mt-3 bg-white rounded-md">
        <div className="px-4 py-2">
          <h2 className="text-sm font-bold text-gray-800"> Images</h2>
        </div>
        <div className="h-[180px] overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 px-1 pb-2">
            {localImages.map((img, index) => (
              <div key={index}>
                <TodaiImage
                  className="rounded-md h-20 cursor-pointer object-cover"
                  src={img.src}
                  alt={`Image ${index + 1}`}
                  width={300}
                  height={200}
                  onClick={() => onImageSelect(img.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <StockImageList onImageSelect={onImageSelect} />
    </div>
  );
}

export default React.memo(ImageList);

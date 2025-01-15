'use client'
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import LinkedInPreview from "@/components/linkedIn-peview/LinkedIn-Preview";
import { useTextOverImage } from "@/hooks/useEditImage";
import { fetchAiCaption } from "@/lib/axios/api";
import {
  DownloadIcon,
  MoveLeft,
  Send
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import WebFont from "webfontloader";
import ColorPicker from "./components/ColorPicker";
import CornerRadiusSlider from "./components/CornerRadiusSlider";
import ImageList from "./components/ImageList";
import OpacitySlider from "./components/OpacitySlider";
import { StageComponent } from "./components/StageComponent";
import { TextOverImageProps } from "./types/editImageTypes";
import dynamic from 'next/dynamic';

interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}
const EditQuotes: React.FC<TextOverImageProps> = ({
  initialText = "Enter Text!",
  initialFontSize = 22,
  initialTextColor = "#000000",
  initialBgColor = "#ffffff",
  initialBgOpacity = 0.5,
  initialCornerRadius = 0,
  selectedQuote,
  setselectedQuote,
}) => {
  const {
    state,
    setState,
    dimensions,
    containerRef,
    groupRef,
    trRef,
    bgColorPickerRef,
    textColorPickerRef,
    opacityRef,
    cornerRadiusRef,
    fontSizeInputRef,
    stageRef,
    image,
    handleStageMouseDown,
    setImage,
  } = useTextOverImage({
    initialText,
    initialFontSize,
    initialTextColor,
    initialBgColor,
    initialBgOpacity,
    initialCornerRadius,
  });
  const [selectedFont, setSelectedFont] = useState<any>("Roboto");
  const [postText, setPostText] = useState<string>("");
  const [generatingAiCaption, setGeneratingAiCaption] =
    useState<boolean>(false);
  // const [fontLoaded, setFontLoaded] = useState(false);
  const textRef = useRef<any>(null);
  const [textStyle, setTextStyle] = useState<TextStyle>({
    bold: false,
    italic: false,
    underline: false,
  });
  const [isBrowser, setIsBrowser] = useState(false);
  const [webFontModule, setWebFontModule] = useState<any>(null);

  useEffect(() => {
    setIsBrowser(true);
    // Dynamically import WebFont
    const loadWebFont = async () => {
      try {
        const WebFont = (await import('webfontloader')).default;
        setWebFontModule(WebFont);
      } catch (error) {
        console.error('Error loading WebFont:', error);
      }
    };
    
    loadWebFont();
  }, []);

  const toggleStyle = (style: keyof TextStyle) => {
    setTextStyle((prev) => ({
      ...prev,
      [style]: !prev[style],
    }));
  };

  const handleFontSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        fontSize: Number(event.target.value),
        showFontSizeList: false,
      }));
    },
    [setState]
  );

  const predefinedFontSizes = Array.from({ length: 19 }, (_, i) => 10 + i * 5);

  const handleImageSelect = useCallback(
    (src: string) => setState((prev) => ({ ...prev, imageSrc: src })),
    [setState]
  );

  const handleColorChange = useCallback(
    (newColor: string, type: "bgColor" | "textColor") => {
      setState((prev) => ({ ...prev, [type]: newColor }));
    },
    [setState]
  );

  const handleSelect = useCallback(() => {
    setState((prev) => ({ ...prev, isSelected: true }));
  }, [setState]);

  const handleGetImage = useCallback(() => {
    return stageRef.current.toDataURL({ pixelRatio: 2 });
  }, [stageRef]);

  const downloadImage = () => {
    setState((prev: any) => ({
      ...prev,
      isSelected: false,
    }));
    setTimeout(() => {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "todai_quotes.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const linkedInPreviewRef = useRef<any>(null);

  const handleLinkedInPreviewClick = async () => {
    setGeneratingAiCaption(true);
    setState((prev: any) => ({
      ...prev,
      isSelected: false,
    }));
    try {
      const data = {
        content: selectedQuote,
        type: "quote",
      };
      const caption: any = await fetchAiCaption(data);
      setPostText(caption?.data?.data.caption);
      setGeneratingAiCaption(false);
      setTimeout(() => {
        if (linkedInPreviewRef.current) {
          linkedInPreviewRef?.current?.handlePostClick();
        }
      }, 0);
    } catch (error) {}
  };
  // const adjustFontSize = () => {
  //   if (!groupRef.current || !textRef.current) return;

  //   const group = groupRef.current;
  //   const text = textRef.current;
  //   const rect = group.findOne("Rect");

  //   if (!rect) return;

  //   const padding = 20; // Padding from edges
  //   const maxWidth = rect.width() - padding * 2;
  //   const maxHeight = rect.height() - padding * 2;

  //   // Start with current font size
  //   let fontSize = state.fontSize;
  //   text.fontSize(fontSize);

  //   // Get text metrics
  //   const textWidth = text.getTextWidth();
  //   const textHeight = text.height();

  //   // Calculate scale factors
  //   const widthScale = maxWidth / textWidth;
  //   const heightScale = maxHeight / textHeight;

  //   // Use the smaller scale to ensure text fits both dimensions
  //   const scale = Math.min(widthScale, heightScale);

  //   // Apply the new font size with a minimum size limit
  //   const newFontSize = Math.max(Math.floor(fontSize * scale), 8);
  //   text.fontSize(newFontSize);

  //   // Center the text
  //   text.x((rect.width() - text.getTextWidth()) / 2);
  //   text.y((rect.height() - text.height()) / 2);
  // };

  // Handle font changes
  // useEffect(() => {
  //   adjustFontSize();
  //   // handleFontChange(selectedFont);
  // }, [selectedFont, selectedQuote, state.fontSize]);

  const adjustFontSize = () => {
    if (!groupRef.current || !textRef.current) return;

    try {
      const group = groupRef.current;
      const text = textRef.current;
      const rect = group.findOne("Rect");

      if (!rect) return;

      const padding = 20;
      const maxWidth = rect.width() - padding * 2;
      const maxHeight = rect.height() - padding * 2;

      let fontSize = state.fontSize;
      text.fontSize(fontSize);

      const textWidth = text.getTextWidth();
      const textHeight = text.height();

      const widthScale = maxWidth / textWidth;
      const heightScale = maxHeight / textHeight;

      const scale = Math.min(widthScale, heightScale);
      const newFontSize = Math.max(Math.floor(fontSize * scale), 8);
      
      text.fontSize(newFontSize);
      text.x((rect.width() - text.getTextWidth()) / 2);
      text.y((rect.height() - text.height()) / 2);
      
      group.getLayer()?.batchDraw();
    } catch (error) {
      console.error('Error adjusting font size:', error);
    }
  };
  useEffect(() => {
    if (isBrowser && webFontModule) {
      adjustFontSize();
    }
  }, [selectedFont, selectedQuote, state.fontSize, isBrowser, webFontModule]);

  // Handle group resize

  // const handleFontChange = (font: string) => {
  //   setSelectedFont(font);
  //   WebFont.load({
  //     google: {
  //       families: [font],
  //     },

  //     active: () => {
  //       console.log("Loaded Google Font");
  //       // setFontLoaded(true);
  //       // Update the text's font family and size in the Konva layer
  //       if (textRef.current) {
  //         textRef.current.fontFamily(font);
  //         textRef.current.fontSize(state.fontSize);
  //         // Update the Rect size to fit the new font size
  //         if (groupRef.current) {
  //           groupRef.current.find("Rect")[0].width(textRef.current.width());
  //           groupRef.current.find("Rect")[0].height(textRef.current.height());
  //           groupRef.current.getLayer().batchDraw();
  //         }
  //       }
  //     },
  //     inactive: () => {
  //       // If the font fails to load, fall back to 'Arial'
  //       // setFontLoaded(true);
  //       if (textRef.current) {
  //         textRef.current.fontFamily("Arial");
  //         textRef.current.fontSize(state.fontSize);
  //         // Update the Rect size to fit the new font size
  //         if (groupRef.current) {
  //           groupRef.current.find("Rect")[0].width(textRef.current.width());
  //           groupRef.current.find("Rect")[0].height(textRef.current.height());
  //           groupRef.current.getLayer().batchDraw();
  //         }
  //       }
  //     },
  //   });
  // };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    
    if (isBrowser && webFontModule) {
      webFontModule.load({
        google: {
          families: [font],
        },
        active: () => {
          if (textRef.current) {
            textRef.current.fontFamily(font);
            textRef.current.fontSize(state.fontSize);
            
            if (groupRef.current) {
              const rect = groupRef.current.find("Rect")[0];
              if (rect) {
                rect.width(textRef.current.width());
                rect.height(textRef.current.height());
                groupRef.current.getLayer()?.batchDraw();
              }
            }
          }
        },
        inactive: () => {
          if (textRef.current) {
            textRef.current.fontFamily("Arial");
            textRef.current.fontSize(state.fontSize);
            
            if (groupRef.current) {
              const rect = groupRef.current.find("Rect")[0];
              if (rect) {
                rect.width(textRef.current.width());
                rect.height(textRef.current.height());
                groupRef.current.getLayer()?.batchDraw();
              }
            }
          }
        },
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-1 w-full">
      <div
        className="absolute top-16 z-40 text-xs m-2 text-brand-primary cursor-pointer hover:text-brand-secondary hover:bg-slate-200 p-1 rounded-md"
        onClick={() => setselectedQuote("")}>
        <div className="flex gap-1 items-center">
          <MoveLeft />
          Quotes
        </div>
      </div>
      <ImageList
        onImageSelect={handleImageSelect}
        text={selectedQuote}
        setText={setselectedQuote}
        setImage={setImage}
        selectedFont={selectedFont}
         handleFontChange={handleFontChange}
        state={state}
        setState={setState}
        handleFontSizeChange={handleFontSizeChange}
        predefinedFontSizes={predefinedFontSizes}
        fontSizeInputRef={fontSizeInputRef}
        textStyle={textStyle}
        toggleStyle={toggleStyle}
      />
      <div
        className="flex flex-col gap-5 items-center w-full bg-gray-100 p-4 rounded-md overflow-clip"
        ref={containerRef}>
        <StageComponent
          dimensions={dimensions}
          state={state}
          image={image}
          selectedQuote={selectedQuote}
          handleStageMouseDown={handleStageMouseDown}
          groupRef={groupRef}
          trRef={trRef}
          stageRef={stageRef}
          onSelect={handleSelect}
          textRef={textRef}
          selectedFont={selectedFont}
          adjustFontSize={adjustFontSize}
          textStyle={textStyle}
          setState={setState}
        />

        <div className="flex items-center justify-center gap-10 w-full relative">
          <div className="flex flex-wrap justify-center items-center bg-white gap-1 lg:gap-10 rounded-lg shadow-xl">
            <div className="flex gap-3 flex-wrap justify-center items-center p-4">
              {/* <FontSelector
                selectedFont={selectedFont}
                onFontChange={handleFontChange}
              />
              <FontSizeSelector
                fontSize={state.fontSize}
                handleFontSizeChange={handleFontSizeChange}
                showFontSizeList={state.showFontSizeList}
                setShowFontSizeList={(show: boolean) =>
                  setState((prev) => ({ ...prev, showFontSizeList: show }))
                }
                predefinedFontSizes={predefinedFontSizes}
                fontSizeInputRef={fontSizeInputRef}
              />
              <div className="flex gap-2 justify-center">
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
              </div> */}
              <ColorPicker
                type="txtColor"
                // label="Text Color"
                color={state.textColor}
                showPicker={state.showPicker.textColor}
                setShowPicker={(show: boolean) =>
                  setState((prev) => ({
                    ...prev,
                    showPicker: { ...prev.showPicker, textColor: show },
                  }))
                }
                handleColorChange={(color: string) =>
                  handleColorChange(color, "textColor")
                }
                pickerRef={textColorPickerRef}
              />
              <ColorPicker
                type="bgColor"
                // label="Background Color"
                color={state.bgColor}
                showPicker={state.showPicker.bgColor}
                setShowPicker={(show: boolean) =>
                  setState((prev) => ({
                    ...prev,
                    showPicker: { ...prev.showPicker, bgColor: show },
                  }))
                }
                handleColorChange={(color: string) =>
                  handleColorChange(color, "bgColor")
                }
                pickerRef={bgColorPickerRef}
              />
              <OpacitySlider
                showOpacitySlider={state.showOpacitySlider}
                setShowOpacitySlider={(show: boolean) =>
                  setState((prev) => ({ ...prev, showOpacitySlider: show }))
                }
                bgOpacity={state.bgOpacity}
                setBgOpacity={(bgOpacity: number) =>
                  setState((prev) => ({ ...prev, bgOpacity }))
                }
                opacityRef={opacityRef}
              />
              <CornerRadiusSlider
                showCornerRadiusSlider={state.showCornerRadiusSlider}
                setShowCornerRadiusSlider={(show: boolean) =>
                  setState((prev) => ({
                    ...prev,
                    showCornerRadiusSlider: show,
                  }))
                }
                cornerRadius={state.cornerRadius}
                setCornerRadius={(cornerRadius: number) =>
                  setState((prev) => ({ ...prev, cornerRadius }))
                }
                cornerRadiusRef={cornerRadiusRef}
              />
            </div>
            <div className="flex gap-3 items-center p-4 overflow-clip">
              {/* <TodaiAnimatedButton
                                onClick={downloadImage}
                                className="border text-black py-2  rounded-md flex items-center">
                                <div className='flex items-center gap-2 text-xs'>
                                    <DownloadIcon className="w-4 h-4" />
                                    Export
                                </div>
                            </TodaiAnimatedButton> */}
              <TodaiAnimatedButton
                onClick={downloadImage}
                type="button"
                variant="primary"
                className="w-fit !px-8 !rounded-3xl !text-brand-primary border bg-transparent hover:!text-white">
                <div className="flex gap-2 text-center text-xs items-center  justify-center">
                  <DownloadIcon className="w-4 h-4" />
                  Export
                </div>
              </TodaiAnimatedButton>

              {/* <TodaiAnimatedButton type='button' variant='primary' className='w-fit !px-5 !rounded-3xl hover:!text-white'>
                                <div className='flex gap-2 text-center text-xs items-center  justify-center'>
                                    <Send className="w-4 h-4" />
                                    Post</div></TodaiAnimatedButton> */}
              <TodaiAnimatedButton
                loading={generatingAiCaption}
                disabled={generatingAiCaption}
                variant="primary"
                onClick={handleLinkedInPreviewClick}
                className="!px-8 rounded-3xl text-white">
                <div className="flex gap-2 text-center text-xs items-center  justify-center">
                  <Send className="w-4 h-4" />
                  Post
                </div>
              </TodaiAnimatedButton>
              <LinkedInPreview
                ref={linkedInPreviewRef}
                imgRef={stageRef}
                postText={postText}
                setPostText={setPostText}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuotes;

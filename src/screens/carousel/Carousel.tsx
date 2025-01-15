"use client";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import TodaiColorPalette from "@/components/color-palatte/TodaiColorPalatte";
import TodaiIcon from "@/components/icon/TodaiIcon";
import TodaiSelect from "@/components/select/TodaiSelect";
import TodaiTabs from "@/components/tabs/TodaiTabs";
import { TodaiButton } from "@/components/TodaiButton";
import TodaiInput from "@/components/TodaiInput";
import TodaiTooltip from "@/components/tooltip";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { fetchAiCaption, fetchCarouselQuotes } from "@/lib/axios/api";
import { cn, convertBlobToFile } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";
import {
  IconEdit,
  IconReload
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Download,
  SparklesIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ColorPicker from "../quotes/components/ColorPicker";
import CarouselPreview from "./components/CarouselPreview";
import SlidePDF from "./components/SlidePdf";
import SlidesDragAndDrop from "./components/SlidesDragAndDrop";
import avatar from "/public/img/avatar-dummy.jpeg";

const fontGroups = [
  {
    label: "Font Family",
    options: [
      {
        value: "Inter",
        label: "Inter",
        fontFamily: "Inter",
      },
      {
        value: "NotoSans",
        label: "Noto Sans",
        fontFamily: "NotoSans",
      },
      { value: "OpenSans", label: "Open Sans", fontFamily: "OpenSans" },
      { value: "Raleway", label: "Raleway", fontFamily: "Raleway" },
      {
        value: "PlayWrite",
        label: "Play Write",
        fontFamily: "PlayWrite",
      },
      {
        value: "Roboto",
        label: "Roboto",
        fontFamily: "Roboto",
      },
    ],
  },
];

const fontSizeGroups = [
  {
    label: "Font Sizes",
    options: [
      { value: "12px", label: "12px", fontSize: "12px" },
      { value: "14px", label: "14px", fontSize: "14px" },
      { value: "16px", label: "16px", fontSize: "16px" },
      { value: "18px", label: "18px", fontSize: "18px" },
      { value: "20px", label: "20px", fontSize: "20px" },
      { value: "24px", label: "24px", fontSize: "24px" },
      { value: "28px", label: "28px", fontSize: "28px" },
    ],
  },
];

const palettes = [
  ["#0d3b66", "#faf0ca", "#f4d35e"],
  ["#386641", "#6a994e", "#a7c957"],
  ["#002642", "#840032", "#e59500"],
  ["#f6f7eb", "#e94f37", "#393e41"],
  ["#006d77", "#83c5be", "#edf6f9"],
  ["#83c9f4", "#a3d5ff", "#d9f0ff"],
  ["#9381ff", "#b8b8ff", "#f8f7ff"],
  ["#cb997e", "#ddbea9", "#ffe8d6"],
  ["#5bc0eb", "#fde74c", "#9bc53d"],
  ["#a8dadc", "#f1faee", "#e63946"],
  ["#f8e16c", "#00c49a", "#156064"],
  ["#a3bac3", "#006989", "#eaebed"],
  ["#fbf6ef", "#fbf6ef", "#ead7c3"],
  ["#2b2d42", "#8d99ae", "#edf2f4"],
  ["#064789", "#427aa1", "#ebf2fa"],
  ["#8fc0a9", "#c8d5b9", "#faf3dd"],
  ["#353535", "#3c6e71", "#ffffff"],
  ["#a3b18a", "#588157", "#dad7cd"],
  ["#d81159", "#ffbc42", "#8f2d56"],
  ["#fca17d", "#da627d", "#f9dbbd"],
];

function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFont, setSelectedFont] = useState(fontGroups[0].options[0]);
  const [selectedSize, setSelectedSize] = useState(
    fontSizeGroups[0].options[3]
  );
  const [selectedPalette, setSelectedPalette] = useState(4);
  const [customColors, setCustomColors] = useState(false);
  const [colors, setColors] = useState({
    primary: palettes[4][0],
    secondary: palettes[4][1],
    background: palettes[4][2],
  });
  const [state, setState] = useState({
    primary: false,
    secondary: false,
    background: false,
  });
  const primaryColorPickerRef = useRef<any>();
  const secondaryColorPickerRef = useRef<any>();
  const bgColorPickerRef = useRef<any>();
  const [slides, setSlides] = useState<any>([]);
  const thumbnailsRef = useRef<any>(null);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const slideFileRef = useRef<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // const [pdfBlobUrl, setPdfBlobUrl] = useState<any>(null);
  let pdfBlobUrl = useRef<any>(null);
  let pdfBase64 = useRef<any>(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [postText, setPostText] = useState<string>("");
  const [generatingAiCaption, setGeneratingAiCaption] =
    useState<boolean>(false);

  const [profileInfo, setProfileInfo] = useState<any>({});
  const { data: profileData } = useProfile();
  const [text, setText] = useState<string>("");
  const { toast } = useToast();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    generate: false,
    refresh: false,
  });
  const searchData = useRef<any>(null);

  const [selectedText, setSelectedText] = useState("");
  const [activeFormats, setActiveFormats] = useState<any>([]);

  // const handleFormatText = (format: any) => {
  //   if (!slides[activeIndex]) return;

  //   let newContent = slides[activeIndex].content;
  //   const selection: any = window.getSelection();

  //   if (selection.toString()) {
  //     const selectedText = selection.toString();
  //     let formattedText = selectedText;

  //     switch (format) {
  //       case "bold":
  //         formattedText = `<strong>${selectedText}</strong>`;
  //         break;
  //       case "italic":
  //         formattedText = `<em>${selectedText}</em>`;
  //         break;
  //       case "underline":
  //         formattedText = `<u>${selectedText}</u>`;
  //         break;
  //     }

  //     newContent = newContent.replace(selectedText, formattedText);

  //     const updatedSlides = [...slides];
  //     updatedSlides[activeIndex] = {
  //       ...updatedSlides[activeIndex],
  //       content: newContent,
  //     };
  //     setSlides(updatedSlides);

  //     // Update active formats
  //     if (activeFormats.includes(format)) {
  //       setActiveFormats(activeFormats.filter((f: any) => f !== format));
  //     } else {
  //       setActiveFormats([...activeFormats, format]);
  //     }
  //   }
  // };

  const { mutate } = useMutation({
    mutationFn: () => fetchCarouselQuotes({ content: text }),
    onSuccess: (response: any) => {
      searchData.current = response?.data?.data;
      setLoading((prev) => ({ generate: false, refesh: false }));
    },
    onError: () => {
      setLoading((prev) => ({ generate: false, refesh: false }));
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Please try again",
      });
    },
  });

  useEffect(() => {
    setProfileInfo({
      ...profileData,
      linkedInHandle:
        "@" + profileData?.first_name + "-" + profileData?.last_name,
      authorName: profileData?.first_name + " " + profileData?.last_name,
    });
  }, [profileData]);

  //   const getProfile = async () => {
  //     const data = await getProfileData1();
  //     if (data.status == 200) {
  //       const profileData = data?.data?.data;
  //       setProfileInfo({
  //         ...profileData,
  //         linkedInHandle:
  //           "@" + profileData.first_name + "-" + profileData.last_name,
  //         authorName: profileData.first_name + " " + profileData.last_name,
  //       });
  //     }
  //   };

  // const {
  //   data: carouselQuotes = [],
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["carouselQuotes"],
  //   queryFn: () => fetchCarouselQuotes({ content: "" }),
  //   select: (data: any) => data?.data.data,
  //   // staleTime: 0,
  //   // gcTime: 0,
  // });

  useEffect(() => {
    // if (carouselQuotes?.length > 0 && slides.length === 0) {
    //   // Initialize slides with quotes data
    //   setSlides(
    //     carouselQuotes.map((quote: any, index: any) => ({
    //       id: `slide-${index}`,
    //       content: quote,
    //       title: `Slide ${index + 1}`,
    //       subtitle: "Slide Subtitle...",
    //     }))
    //   );
    // }
    //set slides content after searching
    if (searchData?.current?.length > 0) {
      setSlides(
        searchData.current.map((quote: any, index: any) => ({
          id: `slide-${index}`,
          content: quote,
          title: `Slide ${index + 1}`,
          subtitle: "Slide Subtitle...",
        }))
      );
    }
  }, [searchData?.current, loading]);

  // Scroll thumbnail into view when active index changes
  useEffect(() => {
    if (thumbnailsRef?.current) {
      const thumbnailElement = thumbnailsRef?.current?.children[activeIndex];
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex]);

  const handleSubmitTopic = (e: any, type: number = 1) => {
    e.preventDefault();
    if (text === "") {
      toast({
        variant: "destructive",
        title: "The input text is not valid.",
        description: "Please provide content.",
      });
      return;
    }
    setLoading((prev) => ({
      ...prev,
      ...(type === 1 ? { generate: true } : { refresh: true }),
    }));

    mutate();
  };

  const handleNext = () => {
    setSlideDirection(1);
    if (activeIndex < slides.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setSlideDirection(-1);
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleThumbnailClick = (index: any) => {
    if (activeIndex > index) {
      setSlideDirection(-1);
    } else if (activeIndex < index) {
      setSlideDirection(1);
    }
    setActiveIndex(index);
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${slides.length}`,
      content: "New slide content...",
      title: `Slide ${slides.length + 1}`,
      subtitle: "New Slide Subtitle...",
    };
    setSlides([...slides, newSlide]);

    // Move to the new slide
    setActiveIndex(slides.length);

    // Use setTimeout to ensure DOM updates before scrolling
    setTimeout(() => {
      if (containerRef.current) {
        // Calculate the scroll position to the last thumbnail
        const thumbnails = containerRef.current.getElementsByClassName("mx-1");
        if (thumbnails.length > 0) {
          const lastThumbnail = thumbnails[
            thumbnails.length - 1
          ] as HTMLElement;

          // Scroll to the last thumbnail with some right-side padding
          containerRef.current.scrollTo({
            left:
              lastThumbnail.offsetLeft -
              containerRef.current.offsetWidth +
              lastThumbnail.offsetWidth +
              100,
            behavior: "smooth",
          });
        }
      }
    }, 0);
  };

  const handleDeleteSlide = (indexToDelete: any) => {
    setSlides(slides.filter((_: any, index: any) => index !== indexToDelete));
    // Adjust active index if necessary
    if (indexToDelete <= activeIndex && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handlePaletteSelect = (index: any) => {
    setSelectedPalette(index);
    setColors({
      primary: palettes[index][0],
      secondary: palettes[index][1],
      background: palettes[index][2],
    });
  };

  const handleFontChange = (value: any) => {
    const newFont = fontGroups[0]?.options.filter(
      (option) => option.value === value
    );
    setSelectedFont(newFont[0]);
  };

  const handleSizeChange = (value: any) => {
    const newSize = fontSizeGroups[0]?.options.filter(
      (option) => option.value === value
    );
    setSelectedSize(newSize[0]);
  };

  const handleDownloadPDF = async () => {
    try {
      // Create blob and download
      const blob = await pdf(
        <SlidePDF
          slides={slides}
          colors={colors}
          font={selectedFont.fontFamily}
          fontSize={selectedSize.fontSize}
          profileInfo={profileInfo}
          profileImage={profileInfo?.image || avatar}
          //   fontSize={28}
        />
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "todai_carousel.pdf";

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating carousel:", error);
    }
  };
  // if (loading) {
  //   return <TodaiCircularLoader />;
  // }

  const linkedInPreviewRef = useRef<any>(null);

  const handleLinkedInPreviewClick = () => {
    if (linkedInPreviewRef.current) {
      linkedInPreviewRef?.current?.handlePostClick();
    }
  };

  const handleCloseSheet = () => {
    setShowPreview(!showPreview);
  };

  const generatePDF = async () => {
    try {
      // Start loading
      setGeneratingAiCaption(true);
      setShowPreview(false);

      // Generate AI caption
      const data = {
        content: slides.map((slide: any) => slide.content).join(", "),
        type: "carousel",
      };
      const captionResponse: any = await fetchAiCaption(data);
      const caption = captionResponse?.data?.data?.caption || "";
      setPostText(caption);

      // Trigger LinkedIn preview if available
      setTimeout(() => {
        linkedInPreviewRef.current?.handlePostClick?.();
      }, 0);

      // Generate PDF as a Blob
      const pdfBlob = await pdf(
        <SlidePDF
          slides={slides}
          colors={colors}
          font={selectedFont.fontFamily}
          fontSize={selectedSize.fontSize}
          profileInfo={profileInfo}
          profileImage={profileInfo?.image || avatar}
        />
      ).toBlob();

      // Convert PDF Blob to File for Base64 conversion
      const pdfFile = await convertBlobToFile(pdfBlob, "todai_carousel.pdf");
      pdfBase64.current = pdfFile;

      // Store PDF Blob and show preview
      pdfBlobUrl.current = pdfBlob;
      setShowPreview(true);
    } catch (error) {
      console.error("Error generating PDF or caption:", error);
      // Show appropriate error state or alert
      setPostText("Error generating caption or PDF.");
    } finally {
      // Stop loading regardless of success or failure
      setGeneratingAiCaption(false);
    }
  };

  const handleContentChange = (newContent: any) => {
    const updatedSlides = [...slides];
    updatedSlides[activeIndex] = {
      ...updatedSlides[activeIndex],
      content: newContent,
    };
    setSlides(updatedSlides);
  };

  const handleReorderSlides = (reorderedSlides: any[]) => {
    setSlides(reorderedSlides);
  };

  return (
    <div className="container max-w-5xl mt-6">
      <form className="flex w-full justify-center" onSubmit={handleSubmitTopic}>
        <div className="flex w-full items-center justify-center rounded-full shadow-md max-w-3xl">
          <TodaiInput
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
            type="text"
            placeholder="Please Enter a Topic for Your Carousel"
            extra="w-full"
            inputClass="flex-grow w-full !border-r-0 !p-4 border border-brand-primary !rounded-l-full !rounded-r-none !outline-none focus-visible:!ring-brand-primary"
          />
          <TodaiAnimatedButton
            disabled={loading.generate}
            loading={loading.generate}
            onClick={handleSubmitTopic}
            type="button"
            variant="primary"
            className="!w-60 text-nowrap self-stretch border border-brand-primary !text-sm !rounded-l-none border-l-0 hover:text-white rounded-r-full hover:!ring-brand-primary">
            <TodaiIcon color="text-slate-300">
              <SparklesIcon className='animate-pulse'/>
            </TodaiIcon>
            Generate Carousel
          </TodaiAnimatedButton>
        </div>
      </form>
      {slides.length > 0 && (
        <div className=" rounded-2xl border text-card-foreground mt-8 bg-white shadow-lg p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            {/* Carousel Content */}
            <div className="col-span-2">
              <div className="border border-gray-200 rounded-2xl p-4 pt-1 overflow-clip space-y-1">
                <TodaiTooltip
                  triggerContent={
                    <div
                      className=" cursor-pointer flex-shrink-0 border-1 w-fit place-self-end"
                      onClick={(e: any) => handleSubmitTopic(e, 2)}>
                      <IconReload
                        className={cn(
                          "text-gray-400 w-4 h-4",
                          loading.refresh && "animate-spin opacity-50"
                        )}
                      />
                    </div>
                  }
                  tooltipContent="Refresh"
                />
                <div
                  className="relative border bg-card text-card-foreground shadow-sm aspect-[1/1] w-full overflow-hidden"
                  style={{ backgroundColor: colors.background }}>
                  {slides[activeIndex] && (
                    <motion.div
                      className="relative flex h-full flex-col justify-center gap-7 p-6 -mt-10"
                      key={slides[activeIndex].id}
                      initial={{
                        x: slideDirection == 1 ? 1000 : -1000,
                        opacity: 0,
                      }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{
                        x: slideDirection == 1 ? -1000 : 1000,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.5 }}>
                      <div className="flex items-center">
                        <Image
                          width={48}
                          height={48}
                          //   src="https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg"
                          src={profileInfo?.image || avatar}
                          alt="Profile"
                          className="mr-2 rounded-full"
                        />
                        <div className="flex flex-col leading-4">
                          <p
                            className="font-semibold"
                            style={{
                              color: colors.primary,
                              //   fontFamily: selectedFont.fontFamily,
                              //   fontSize: selectedSize.fontSize,
                              fontSize: "18px",
                            }}>
                            {profileInfo?.authorName}
                          </p>
                          <p
                            className="text-sm"
                            style={{
                              color: colors.primary,
                              fontFamily: selectedFont.fontFamily,
                            }}>
                            {profileInfo?.linkedInHandle}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        {/* <p
                          className="text-2xl font-semibold flex flex-wrap "
                          style={{
                            color: colors.secondary,
                            fontFamily: selectedFont.fontFamily,
                            fontSize: selectedSize.fontSize,
                          }}>
                          {slides[activeIndex].content}
                        </p> */}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: slides[activeIndex].content,
                          }}
                          style={{
                            whiteSpace: "pre-wrap",
                            color: colors.secondary,
                            fontFamily: selectedFont.fontFamily,
                            fontSize: selectedSize.fontSize,
                          }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Show navigation arrows only when there are more slides */}
                  {activeIndex > 0 && (
                    <div className="absolute top-1/2 transform -translate-y-1/2 ml-1">
                      <button
                        className="inline-flex items-center justify-center rounded-full h-6 w-6 bg-slate-400 bg-opacity-15 hover:bg-opacity-50"
                        onClick={handlePrev}>
                        <ChevronLeftIcon />
                      </button>
                    </div>
                  )}
                  {activeIndex < slides.length - 1 && (
                    <div className="absolute top-1/2 right-1 transform -translate-y-1/2">
                      <button
                        className="inline-flex items-center justify-center rounded-full h-6 w-6 bg-slate-400 bg-opacity-15 hover:bg-opacity-50"
                        onClick={handleNext}>
                        <ChevronRightIcon />
                      </button>
                    </div>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {/* <div
                  ref={thumbnailsRef}
                  className="max-w-full pt-2 flex overflow-x-auto pb-2 scroll-smooth items-center">
                  {slides.map((slide: any, index: any) => (
                    <div
                      key={slide.id}
                      className={`mx-1 cursor-pointer flex-shrink-0 border-1 border-primary relative ${
                        index === activeIndex ? "" : "opacity-65"
                      }`}
                      onClick={() => handleThumbnailClick(index)}>
                      <div
                        className="rounded-lg border bg-card text-card-foreground shadow-sm w-16 h-16  overflow-hidden flex flex-col justify-center items-start px-1"
                        style={{ backgroundColor: colors.background }}>
                        <div className="flex items-center -mt-3">
                          <Image
                            width={8}
                            height={8}
                            src={profileInfo?.image || avatar}
                            alt="Profile"
                            className="mr-1 rounded-full"
                          />
                          <div>
                            <p
                              className="text-[2px]"
                              style={{
                                color: colors.primary,
                                fontFamily: selectedFont.fontFamily,
                              }}>
                              {profileInfo?.first_name} {profileInfo?.last_name}
                            </p>
                            <p
                              className="text-[2px]"
                              style={{
                                color: colors.primary,
                                fontFamily: selectedFont.fontFamily,
                              }}>
                              @{profileInfo?.first_name}-
                              {profileInfo?.last_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <h4
                            className="text-[2px] font-bold leading-tight"
                            style={{ color: colors.primary }}>
                            {slide.content}
                          </h4>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(index);
                        }}
                        className="text-gray-400 absolute top-1 right-1 w-3 h-3 hover:text-brand-silver rounded-md">
                        <IconTrashFilled className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <TodaiTooltip
                    triggerContent={
                      <div
                        className=" cursor-pointer flex-shrink-0 border-1 border-dashed sticky right-0 bg-white pl-1"
                        onClick={handleAddSlide}>
                        <div className="rounded-lg border border-dashed border-gray-400 border-spacing-2 bg-card shadow-sm w-16 h-16 flex justify-center items-center">
                          <IconPlus className="text-gray-400" />
                        </div>
                      </div>
                    }
                    tooltipContent="Add New Slide"
                  />
                </div> */}
                <SlidesDragAndDrop
                  containerRef={containerRef}
                  slides={slides}
                  activeIndex={activeIndex}
                  profileInfo={profileInfo}
                  colors={colors}
                  selectedFont={selectedFont}
                  handleThumbnailClick={handleThumbnailClick}
                  handleDeleteSlide={handleDeleteSlide}
                  handleAddSlide={handleAddSlide}
                  onReorderSlides={handleReorderSlides}
                />
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="lg:col-span-1 flex flex-col">
              <TodaiTabs
                quote={slides[activeIndex]?.content || ""}
                setSlides={setSlides}
                activeIndex={activeIndex}
                profileInfo={profileInfo}
                setProfileInfo={setProfileInfo}
                handleContentChange={handleContentChange}
              />

              <div className="space-y-4 grow">
                <div className="flex gap-2">
                  <TodaiSelect
                    placeholder="Select Font"
                    groups={fontGroups}
                    value={selectedFont.value}
                    onChange={handleFontChange}
                  />
                  <TodaiSelect
                    placeholder="Select Font Size"
                    groups={fontSizeGroups}
                    value={selectedSize.value}
                    onChange={handleSizeChange}
                  />
                </div>
                <div className="flex flex-col gap-3 w-full border-t mt-3 pt-2">
                  <div className="flex justify-between items-center w-full">
                    <h6 className="text-sm">Color palette</h6>
                  </div>

                  <div className="flex gap-2 justify-between flex-wrap grow w-full ">
                    {palettes.map((colors, index) => (
                      <TodaiColorPalette
                        key={index}
                        colors={colors}
                        isSelected={selectedPalette === index}
                        onClick={() => handlePaletteSelect(index)}
                      />
                    ))}
                  </div>
                  {/* //custom colors */}
                  <div className="flex items-center gap-1 mt-6">
                    <p className="text-sm">Custom Colors</p>
                    <Switch
                      checked={customColors}
                      onCheckedChange={setCustomColors}
                    />
                  </div>
                  {customColors && (
                    <div className="mt-4 flex justify-between w-full">
                      <div>
                        <label className="text-sm mb-2 block">Primary</label>

                        {/* <HexColorPicker
                      color={colors.primary}
                      onChange={(color) =>
                        setColors({ ...colors, primary: color })
                      }
                    /> */}
                        <ColorPicker
                          // label="Text Color"
                          color={colors.primary}
                          // setColor={setColors({ ...colors, background: colors.primary })}
                          showPicker={state.primary}
                          setShowPicker={(show: boolean) =>
                            setState((prev) => ({
                              ...prev,
                              primary: !prev.primary,
                              secondary: false,
                              background: false,
                            }))
                          }
                          handleColorChange={(color: string) =>
                            setColors({ ...colors, primary: color })
                          }
                          pickerRef={primaryColorPickerRef}
                          pickerPosition="top"
                        />
                      </div>
                      <div>
                        <label className="text-sm mb-2 block">Secondary</label>
                        {/* <HexColorPicker
                      color={colors.secondary}
                      onChange={(color) =>
                        setColors({ ...colors, secondary: color })
                      }
                    /> */}
                        <ColorPicker
                          // label="Text Color"
                          color={colors.secondary}
                          // setColor={setColors({ ...colors, background: colors.secondary })}
                          showPicker={state.secondary}
                          setShowPicker={(show: boolean) =>
                            setState((prev) => ({
                              ...prev,
                              secondary: !prev.secondary,
                              primary: false,
                              background: false,
                            }))
                          }
                          handleColorChange={(color: string) =>
                            setColors({ ...colors, secondary: color })
                          }
                          pickerRef={secondaryColorPickerRef}
                          pickerPosition="top"
                        />
                      </div>
                      <div>
                        <label className="text-sm mb-2 block">Background</label>
                        {/* <HexColorPicker
                      color={colors.background}
                      onChange={(color) =>
                        setColors({ ...colors, background: color })
                      }
                    /> */}
                        <ColorPicker
                          // label="Text Color"
                          color={colors.background}
                          // setColor={setColors({ ...colors, background: colors.background })}
                          showPicker={state.background}
                          setShowPicker={(show: boolean) =>
                            setState((prev) => ({
                              ...prev,
                              background: !prev.background,
                              primary: false,
                              secondary: false,
                            }))
                          }
                          handleColorChange={(color: string) =>
                            setColors({ ...colors, background: color })
                          }
                          pickerRef={bgColorPickerRef}
                          pickerPosition="top"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1 items-center justify-around mt-2 border-t pt-3">
                <TodaiButton
                  onClick={handleDownloadPDF}
                  variant="primary-outline"
                  className="flex items-center gap-2 text-sm !px-4 !rounded-3xl !text-brand-primary border bg-transparent hover:!text-white">
                  <div className="flex gap-2 text-center text-xs items-center  justify-center">
                    <Download className="w-4 h-4" />
                    Download
                  </div>
                </TodaiButton>
                {/* <TodaiDropdown
                type="button"
                variant="primary"
                onClick={handleDownloadPDF}
                className="flex items-center text-xs">
                <IconSend className="w-4 h-4" />
                Post
              </TodaiDropdown> */}
                {/* <TodaiDropdown content={"postText"} /> */}
                <TodaiAnimatedButton
                  loading={generatingAiCaption}
                  disabled={generatingAiCaption}
                  variant="primary"
                  onClick={generatePDF}
                  className=" !px-6 !rounded-3xl !text-white border hover:!text-white">
                  <div className="flex gap-1 text-center text-xs items-center  justify-center">
                    <IconEdit className="w-4 h-4" />
                    Edit & Post
                  </div>
                </TodaiAnimatedButton>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {loading && <TodaiCircularLoader />} */}
      <>
        {showPreview && (
          <CarouselPreview
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            profileInfo={profileInfo}
            pdfBlobUrl={pdfBlobUrl}
            avatar={avatar}
            pdfBase64={pdfBase64}
            postText={postText}
            setPostText={setPostText}
          />
        )}
      </>
    </div>
  );
}

export default Carousel;

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   slideContainer: {
//     width: "100%",
//     height: "100%",
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     margin: "-100px",
//     width: "100%",
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   profileInfo: {
//     marginLeft: 10,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//   },
//   name: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   username: {
//     fontSize: 9,
//     color: "#666",
//   },
//   content: {
//     marginTop: 20,
//     textAlign: "left",
//     fontWeight: "semibold",
//   },
//   image: {
//     width: 35,
//     height: 35,
//     borderRadius: 20, // Circular image
//   },
// });

// Font.register({
//   family: "Arial",
//   src: "/fonts/arial.ttf",
// });
// Font.register({
//   family: "PlayWrite",
//   src: "/fonts/PlaywriteGBS-VariableFont_wght.ttf",
// });
// Font.register({
//   family: "WindSong-Medium",
//   src: "/fonts/WindSong-Medium.ttf",
// });
// Font.register({
//   family: "Inter",
//   src: "/fonts/Inter_18pt-Medium.ttf",
// });
// Font.register({
//   family: "NotoSans",
//   src: "/fonts/NotoSans_Condensed-Medium.ttf",
// });
// Font.register({
//   family: "OpenSans",
//   src: "/fonts/OpenSans_Condensed-Medium.ttf",
// });
// Font.register({
//   family: "Raleway",
//   src: "/fonts/Raleway-Medium.ttf",
// });
// Font.register({
//   family: "RobotoMono",
//   src: "/fonts/RobotoMono-Medium.ttf",
// });

// const SlidePDF = ({
//   slides,
//   colors,
//   font,
//   fontSize,
//   profileInfo,
//   profileImage,
// }: any) => (
//   <Document>
//     {slides.map((slide: any, index: any) => (
//       <Page key={slide.id} style={styles.page} size={[336, 426]}>
//         <View
//           style={[
//             styles.slideContainer,
//             { backgroundColor: colors.background },
//           ]}>
//           <View style={styles.header}>
//             <ReactImage
//               style={styles.image}
//               //   src="https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9292.jpg"
//               src={profileImage || "/img/avatar-dummy.jpeg"}
//             />
//             <View style={styles.profileInfo}>
//               <Text
//                 style={[
//                   styles.name,
//                   { color: colors.primary, fontFamily: font },
//                 ]}>
//                 {profileInfo?.authorName}
//               </Text>
//               <Text
//                 style={[
//                   styles.username,
//                   { color: colors.primary, fontFamily: font },
//                 ]}>
//                 {profileInfo?.linkedInHandle}
//               </Text>
//             </View>
//           </View>
//           <Text
//             style={[
//               styles.content,
//               {
//                 color: colors.secondary,
//                 fontFamily: font,
//                 fontSize: parseInt(fontSize),
//               },
//             ]}>
//             {slide.content}
//           </Text>
//         </View>
//       </Page>
//     ))}
//   </Document>
// );

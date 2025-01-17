import { TodaiButton } from "@/components/TodaiButton";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { editClip, getSubtitles, updateSubtitles } from "@/lib/axios/api";
import { formatSubtitleTime } from "@/lib/utils/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";

type PropSubEditor = {
  inputVideo: { videoId: number; videoUrl: string };
  setInputVideo: React.Dispatch<
    React.SetStateAction<{ videoId: number; videoUrl: string }>
  >;
};
type Subtitle = {
  start: string;
  end: string;
  text: string;
  index: number;
};

type Selection = {
  text: string;
  index: number;
} | null;

export const SubtitleEditor = ({
  inputVideo,
  setInputVideo,
}: PropSubEditor) => {
  const [selectedColor, setSelectedColor] = useState("#22ba14");
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  //   const queryClient = useQueryClient();
  const { toast } = useToast();
  const [vid] = useLocalStorage("sub_vid", "");
  const editedSubtitles = useRef<Array<{
    subtitle_number: number;
    new_text: string;
  }> | null>(null);
  const selectionRef = useRef<Selection>(null);
  const [isUpdatingSub, setIsUpdatingSub] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["subtitles"],
    queryFn: () => getSubtitles(inputVideo.videoId),
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    data && setSubtitles(data.data.data);
  }, [data]);

  const handleTextSelection = (subtitleIndex: number) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    if (selectedText) {
      selectionRef.current = {
        text: selectedText,
        index: subtitleIndex,
      };
    }
  };

  const handleSubtitleChange = (subtitleIndex: number, newText: string) => {
    setSubtitles((prevSubtitles) => {
      const newSubtitles = [...prevSubtitles];
      const subtitleToUpdate = newSubtitles.find(
        (sub) => sub.index === subtitleIndex
      );

      if (subtitleToUpdate && subtitleToUpdate.text !== newText) {
        subtitleToUpdate.text = newText;

        if (!editedSubtitles.current) {
          editedSubtitles.current = [];
        }

        editedSubtitles.current = editedSubtitles.current.filter(
          (subtitle) => subtitle.subtitle_number !== subtitleIndex
        );

        // Add the new edit
        editedSubtitles.current.push({
          subtitle_number: subtitleIndex,
          new_text: newText,
        });

        return newSubtitles;
      }

      return prevSubtitles;
    });
  };

  const applyColorToSelection = (color: string) => {
    if (!selectionRef.current) return;

    const { text: selectedText, index } = selectionRef.current;
    const subtitleIndex = index - 1;
    const subtitle = subtitles[subtitleIndex];
    if (!subtitle) return;

    const currentText = subtitle.text;
    const wrappedTextRegex = /<font color="[^"]*">([^<]*)<\/font>/g;
    let newText = currentText;

    let match;
    while ((match = wrappedTextRegex.exec(currentText)) !== null) {
      const [fullMatch, content] = match;
      if (selectedText.includes(content)) {
        newText = newText.replace(fullMatch, content);
      }
    }

    newText = newText.replace(
      selectedText,
      `<font color="${color}">${selectedText}</font>`
    );

    const newSubtitles = [...subtitles];
    newSubtitles[subtitleIndex] = {
      ...subtitle,
      text: newText,
    };

    const editedSubtitle: { subtitle_number: number; new_text: string } = {
      subtitle_number: subtitleIndex + 1,
      new_text: newText,
    };

    if (!editedSubtitles.current) {
      editedSubtitles.current = [];
    }

    editedSubtitles.current = editedSubtitles.current.filter(
      (subtitle) => subtitle.subtitle_number !== subtitleIndex + 1
    );

    editedSubtitles.current.push(editedSubtitle);

    setSubtitles(newSubtitles);

    // Preserve selection
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      const range = document.createRange();
      const contentElement = document.querySelector(
        `[data-subtitle-index="${index}"]`
      );
      if (contentElement) {
        range.selectNodeContents(contentElement);
        selection.addRange(range);
      }
    }
  };

  const mutation = useMutation({
    mutationFn: () => {
      setIsUpdatingSub(true);
      return updateSubtitles({
        videoId: parseInt(vid),
        subtitles: editedSubtitles.current,
      });
    },
    onSuccess: async () => {
      const editResponse: any = await editClip({ videoId: inputVideo.videoId });
      console.log("🚀 ~ onSuccess: ~ editResponse:", editResponse);
      //   queryClient.invalidateQueries({ queryKey: [`subtitles,${vid}`] });
      const videoDetails = inputVideo;
      setInputVideo({
        videoId: 0,
        videoUrl: "",
      });
      setTimeout(() => {
        setInputVideo(videoDetails);
      }, 100);
      toast({
        title: "Subtitle updated successfully!",
        description: "Subtitle updated successfully!",
      });
      setIsUpdatingSub(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Please try again",
      });
      setIsUpdatingSub(false);
    },
  });

  if (isLoading) return <div className="p-4">Loading subtitles...</div>;

  return (
    <>
      <h2 className="text-sm font-bold text-gray-800">Subtitle</h2>
      <Card className="p-4 pb-0 max-w-4xl max-h-96 overflow-auto overflow-x-clip">
        <div className="space-y-3">
          {subtitles.map((subtitle) => (
            <div
              key={subtitle.index}
              className="flex gap-4 border border-slate-400 bg-[#b6bbc1] rounded-md justify-center items-center">
              <div className="w-fit text-sm text-gray-600 flex flex-col justify-stretch border-r border-slate-400 p-2 gap-1">
                <div className=" bg-blue-200 p-1 rounded-md text-center flex justify-around">
                  <span>Start:</span> {formatSubtitleTime(subtitle.start)}
                </div>
                <div className=" bg-blue-200 p-1 rounded-md text-center flex justify-around">
                  <span>End:</span> {formatSubtitleTime(subtitle.end)}
                </div>
              </div>
              <div className="flex-1 h-full pr-1 py-1 text-white">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  tabIndex={0}
                  data-subtitle-index={subtitle.index}
                  onMouseUp={() => handleTextSelection(subtitle.index)}
                  onBlur={(e) =>
                    handleSubtitleChange(
                      subtitle.index,
                      e.currentTarget.innerHTML
                    )
                  }
                  //   onInput={e => console.log('Text inside div', e.currentTarget.textContent)}
                  className="subtitle-content p-2 min-h-[50px] whitespace-pre-wrap bg-[#b6bbc1] overflow-auto break-words border border-transparent rounded-md focus:!border-blue-500 focus:outline-none"
                  dangerouslySetInnerHTML={{ __html: subtitle.text }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 sticky bottom-0 bg-white flex gap-2 justify-around items-center p-2">
          <div className="flex items-center gap-2 ">
            <label
              htmlFor="colorPicker"
              className="text-sm font-medium text-gray-700">
              Text Color
            </label>
            <input
              id="colorPicker"
              type="color"
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
                applyColorToSelection(e.target.value);
              }}
              className="w-8 h-8 rounded border border-gray-200"
            />
          </div>
          <div>
            <TodaiButton
              disabled={isUpdatingSub}
              loading={isUpdatingSub}
              onClick={() => mutation.mutate()}
              variant="primary-outline"
              className="text-xs hover:text-white min-w-32 ">
              Update Subtitles
            </TodaiButton>
          </div>
          {/* <div className="flex items-center gap-4">
          {currentSelection && (
            <div className="text-sm text-gray-600">
              Selected text from subtitle #{currentSelection.index}: "
              {currentSelection.text}"
            </div>
          )}
        </div> */}
        </div>
      </Card>
    </>
  );
};

export default SubtitleEditor;

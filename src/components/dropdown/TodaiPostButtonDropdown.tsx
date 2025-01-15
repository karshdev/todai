"use client";
import loadingIcon from "@/assets/img/loading-circle.svg";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchAllFreeSlots,
  postNow,
  schedulePost,
  uploadResources,
} from "@/lib/axios/api";
import {
  IconCalendarClock,
  IconChevronDown,
  IconSend,
  IconSend2
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TodaiAnimatedButton } from "../button/TodaiAnimatedButton";
import TodaiIcon from "../icon/TodaiIcon";
import TodaiCircularLoader from "../loader/TodaiCircularLoader";
import { TodaiImage } from "../TodaiImage";
import { useToast } from "../ui/use-toast";

type TodaiDropdownProp = {
  content: string;
  asset?: any;
  fileInput?: any;
  closeAllModal?: any;
  disabled?: boolean;
};
type PostData = {
  type?: string;
  content: string;
  interest?: number;
  assets?: number[] | [];
  slot_id?: number | undefined;
};
function TodaiDropdown({
  content,
  asset,
  fileInput,
  closeAllModal,
  disabled = false,
}: TodaiDropdownProp) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [getTimeSlots, setGetTimeSlots] = useState(false);
  const [filteredTimeSlot, setFilteredTimeSlot] = useState<any>();
  const [postData, setPostData] = useState<PostData>();
  const [uploading, setUploading] = useState<{ fileUploading: boolean }>({
    fileUploading: false,
  });

  const {
    data: freeTimeSlots,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["timeSlotFetch"],
    queryFn: fetchAllFreeSlots,
    select: (data) => data.data.data,
    enabled: getTimeSlots,
    staleTime: 0,
    gcTime: 0,
  });
  useEffect(() => {
    setFilteredTimeSlot(freeTimeSlots);
  }, [freeTimeSlots]);

  // const getAllFreeTimeSlots = () => {
  //     setGetTimeSlots(true);
  // };

  const handleSuccess = React.useCallback(
    (response: AxiosResponse<any>) => {
      if (response.status === 200) {
        setUploading({ fileUploading: false });
        setGetTimeSlots(false);
        closeAllModal();
        queryClient.invalidateQueries({ queryKey: ["calendar"] });
        toast({
          variant: "default",
          title: "Success!",
          description: "Posted Scheduled Successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!",
          description: "Something went wrong, please try again.",
        });
      }
    },
    [toast, queryClient]
  );

  const {
    data: sheduelPost,
    isLoading: loadingShedule,
    error: sheduleError,
  } = useQuery({
    queryKey: ["shedulePost", postData],
    queryFn: () => {
      if (!postData) {
        throw new Error("Post data is not available");
      }
      if (!postData?.type) {
        return postNow(postData);
      }
      return schedulePost(postData);
    },
    enabled: !!postData,
  });

  useEffect(() => {
    if (sheduelPost) {
      handleSuccess(sheduelPost);
    }
  }, [sheduelPost, handleSuccess]);

  const handlePostBtnClick = async (type: string, timeSlot?: number) => {
    setUploading({ fileUploading: true });
    const file = fileInput.current ? fileInput.current : asset ? asset : null;
    let fileid = 0;
    if (file) {
      const response = await uploadResources(file);
      fileid = response?.data?.data.id;
    }
    let data: PostData = {
      ...(type !== "now" && { type }),
      content,
      interest: 5,
      assets: fileid != 0 ? [fileid] : [],
    };
    if (timeSlot) {
      data = { ...data, slot_id: timeSlot };
    }
    setPostData(data);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled || uploading.fileUploading}>
        <TodaiAnimatedButton
          variant="primary"
          disabled={disabled || uploading.fileUploading}
          className="float-right w-full !px-5 py-2 rounded-3xl text-white flex items-center justify-center min-w-32">
          {!uploading.fileUploading ? (
            <div className="flex gap-4 text-center text-sm items-center  justify-between">
              <div className="flex gap-2 items-center justify-center">
                <TodaiIcon height={15} width={15} color="text-slate-300">
                  <Send />
                </TodaiIcon>
                Post
              </div>
              <IconChevronDown className="text-slate-300" />
            </div>
          ) : (
            <TodaiImage
              className="animate-spin h-5 w-5 text-white"
              src={loadingIcon}
              width={100}
              height={100}
              alt="loading"
            />
          )}
        </TodaiAnimatedButton>
      </DropdownMenuTrigger>
      {/* <DropdownMenuContent side='top' className=" mr-2 w-44"> */}
      <DropdownMenuContent className=" mr-2 w-44">
        {/* <DropdownMenuLabel >Select action</DropdownMenuLabel>
                <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem><div className='flex gap-1 items-center'> <TodaiIcon height={20} width={20} ><IconCalendarClock /></TodaiIcon>Schedule Post</div></DropdownMenuItem> */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger onMouseEnter={() => setGetTimeSlots(true)}>
            <div className="flex gap-1 items-center">
              {" "}
              <TodaiIcon height={20} width={20}>
                <IconCalendarClock />
              </TodaiIcon>
              Schedule Post
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="max-h-96 relative mb-4">
              <Command>
                <CommandInput
                  placeholder="Find Time Slot..."
                  autoFocus={true}
                />
                <CommandList>
                  {isLoading && <TodaiCircularLoader height="h-80" />}
                  <CommandEmpty>No time slot found!.</CommandEmpty>
                  <CommandGroup>
                    {filteredTimeSlot?.length > 0 &&
                      filteredTimeSlot?.map((slot: any) => (
                        <CommandItem
                          className="border-b rounded-none hover:rounded-md"
                          key={slot.id}
                          value={slot.id}
                          onSelect={(value) => {
                            handlePostBtnClick("later", slot.id);
                          }}>
                          {formatDate(slot.post_date)}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={() => handlePostBtnClick("next")}>
          <div className="flex gap-1 items-center">
            {" "}
            <TodaiIcon height={20} width={20}>
              <IconSend2 />
            </TodaiIcon>
            Post Next
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex gap-1 items-center" onClick={() => handlePostBtnClick("now")}>
            {" "}
            <TodaiIcon height={20} width={20}>
              <IconSend />
            </TodaiIcon>
            Post Now
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TodaiDropdown;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    weekday: "long", // full weekday name
    year: "numeric",
    month: "long", // full month name
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short", // include timezone abbreviation
  });
};

import { TodaiButton } from "@/components/TodaiButton";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import { useToast } from "@/components/ui/use-toast";
import {
  AddNewTimeSlot,
  fetchAllTimeSlots,
  fetchDayOfWeekValues,
  updateimeSlot,
} from "@/lib/axios/api";
import { Day, SlotsData } from "@/lib/axios/types/type";
import { IconCalendarPlus, IconClock24, IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "flatpickr/dist/themes/light.css";
import { useEffect, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import flatpickerstyles from "../../../../styles/Flatpicker.module.css";
import ScheduleTable from "./ScheduleTable";
import TodaiIcon from "@/components/icon/TodaiIcon";
import { DayData, ScheduleData } from "../types/type";

export const TimeSlot = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: dayOfWeekValues } = useQuery({
    queryKey: ["dayOfWeekValues"],
    queryFn: fetchDayOfWeekValues,
    select: (data: any) => data?.data?.data,
    // staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const [addNewSlot, setAddNewSlot] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingData, setLoadingData] = useState({
    createTimeSlot: false,
    updateTimeSlot: false,
  });
  const {
    data: timeSlot,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["timeSlot"],
    queryFn: fetchAllTimeSlots,
    select: (data: any) => data?.data?.data,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });

  useEffect(() => {
    setTimeSlots(timeSlot);
  }, [timeSlot]);

  const createTimeSlotMutation = useMutation({
    mutationFn: (data: SlotsData) => AddNewTimeSlot(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["timeSlot"] });
      setLoadingData((prev) => ({ ...prev, createTimeSlot: false }));
      toast({
        title: "Time slot added successfully!",
        description: "Your new time slot has been added.",
      });
    },
    onError: (error: any) => {
      setLoadingData((prev) => ({ ...prev, createTimeSlot: false }));
      toast({
        variant: "destructive",
        title: error?.response?.data.message || "Something went wrong!",
        description: "Please try again",
      });
    },
  });

  const newSlot = useRef(new Date());

  const handleChangeTime = (value: any) => {
    newSlot.current = new Date(value);
  };

  const handleAddNewSlot = () => {
    setLoadingData((prev) => ({ ...prev, createTimeSlot: true }));
    const ids: number[] = dayOfWeekValues.map((day: Day) => day.id);
    const time = getSelectedTime(newSlot.current);
    const newSlotDt = {
      slots: [
        {
          time: time || "",
          days: ids || [1, 2, 3, 4, 5, 6, 7],
        },
      ],
    };
    createTimeSlotMutation.mutate(newSlotDt);
  };

  const getSelectedTime = (selectedDate: Date) => {
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return null;
  };

  const updateTimeSlot = useMutation({
    mutationFn: (data: any) => updateimeSlot(data),
    onSuccess: (response) => {
      //queryClient.invalidateQueries({ queryKey: ['timeSlot'] });
      setLoadingData((prev) => ({ ...prev, updateTimeSlot: false }));
      toast({
        title: "Time slot updated successfully!.",
        description: "Your time slot has been updated.",
      });
    },
    onError: (error) => {
      console.log("🚀 ~ TimeSlot ~ error:", error);
      setLoadingData((prev) => ({ ...prev, updateTimeSlot: false }));
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Please try again",
      });
    },
  });

  const handleUpdateSlot = () => {
    setLoadingData((prev) => ({ ...prev, updateTimeSlot: true }));
    const newSlots = timeSlots?.map((slot: ScheduleData) => {
      const [hours, minutes] = slot.time.split(":");
      const formattedTime = `${hours}:${minutes}`;

      return {
        time: formattedTime,
        days: slot.days.map((day: DayData) => day.day.id),
      };
    });
    const updateSlots = { slots: [...newSlots] };
    console.log("🚀 ~ handleUpdateSlot ~ updateSlots:", updateSlots);
    updateTimeSlot.mutate(updateSlots);
  };

  return (
    <div
      className={`${flatpickerstyles.flatpickrCalendar} bg-white  max-w-2xl mx-auto mt-5 max-h-[650px] overflow-y-auto`}>
      {timeSlot && (
        <ScheduleTable
          timeSlots={timeSlots}
          setTimeSlots={setTimeSlots}
          //   updateTimeSlot={updateTimeSlot}
        />
      )}
      <div className="flex flex-col justify-between items-center mb-4 gap-4">
        <div className="flex justify-between items-center w-full p-3">
          <TodaiButton
            variant="text"
            className="!text-blue-600 hover:!text-blue-900 shadow-md  flex !px-5 rounded-md items-center place-self-start"
            onClick={() => setAddNewSlot((prev) => !prev)}>
            <IconClock24 size={20} className="mr-1" />
            Add a new slot
          </TodaiButton>
          <TodaiButton
            disabled={loadingData.updateTimeSlot}
            loading={loadingData.updateTimeSlot}
            variant="primary-outline"
            className="hover:!text-white w-48 flex justify-center items-center"
            onClick={handleUpdateSlot}>
            Update schedule
          </TodaiButton>
        </div>
        {addNewSlot && (
          <div className="border flex gap-4 p-3 mb-10 w-full shadow-md rounded-md items-center justify-center">
            <Flatpickr
              data-enable-time
              data-no-calendar
              data-static
              value={newSlot.current}
              options={{
                dateFormat: "h:i K",
                // time_24hr: true,
                clickOpens: true,
                enableSeconds: false,
                defaultHour: 13,
                minuteIncrement: 1,
                ariaDateFormat: "h:i K",
                disableMobile: true,
              }}
              onChange={handleChangeTime}
              className="w-60 p-2 border rounded font-bold text-center"
            />
            <TodaiAnimatedButton
              disabled={loadingData.createTimeSlot}
              loading={loadingData.createTimeSlot}
              variant="primary"
              className=" shadow-md w-48"
              onClick={handleAddNewSlot}>
              <TodaiIcon color="text-slate-300">
                <IconCalendarPlus />
              </TodaiIcon>
              Add Slot
            </TodaiAnimatedButton>
          </div>
        )}
      </div>
    </div>
  );
};

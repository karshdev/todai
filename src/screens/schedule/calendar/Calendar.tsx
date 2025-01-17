"use client";
import { TodaiButton } from "@/components/TodaiButton";
import TodaiDialog from "@/components/dialog/TodaiDialog";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import { fetchAllSlotsInQueue, fetchPostDetailsById } from "@/lib/axios/api";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styles from "../../../styles/FullCalendarComponent.module.css";
import { TimeSlot } from "./components/TimeSlots";
import ViewPost from "./components/ViewPost";

function Calendar() {
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [postDetails, setPostDetails] = useState<any>();
  const [showPost, setShowPost] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["calendar"],
    queryFn: fetchAllSlotsInQueue,
    select: (data: any) =>
      data?.data?.data
        .filter((slot: any) => Object.keys(slot.post).length > 0)
        .map((slot: any) => ({
          id: slot.id,
          date: slot.post_date,
          title: slot.post.body,
          postId: slot.post.id,
        })),
    // refetchOnMount: true,
    // retryOnMount: true,
    retry: 3,
  });

  useEffect(() => {
    setAvailableSlots(data);
  }, [data]);

  const {
    mutate,
    data: postData,
    isPending,
    isError: postLoadError,
  } = useMutation({
    mutationFn: (postId: number) => fetchPostDetailsById(postId),
    onSuccess: (data: any) => {
      setPostDetails(data.data.data);
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });

  if (isLoading) return <TodaiCircularLoader />;
  if (isError) return <div>Error loading calendar events</div>;

  // const handleDateClick = (arg: any) => {
  //     alert('Date click! ' + arg.dateStr)
  // }

  const handleEventClick = (arg: any) => {
    // alert('Event click! ' + arg.event.title)
    setPostDetails(null);
    mutate(arg.event.extendedProps.postId);
    setShowPost(true);
  };

  // const handleEventDrop = (arg: any) => {
  //     alert('Event dropped! ' + arg.event.title)
  // }

  const deletePostFromList = (id: number) => {
    setAvailableSlots(availableSlots.filter((item: any) => item.postId !== id));
    queryClient.invalidateQueries({ queryKey: ["calendar"] });
  };
  return (
    <div
      className={`${styles.calendarContainer} flex-col w-full xl:w-[80%] h-full p-8 shadow-lg rounded-md`}>
      <div className="flex justify-end mb-2">
        <TodaiDialog
          dialogWidth="w-[90vw] lg:w-[800px]"
          extraClass="!p-4"
          dialogTitle="Add/Edit post time slot"
          triggerContent={
            <TodaiButton
              variant="text"
              className="bg-white px-4 py-2 text-sm !rounded-lg shadow-lg !text-brand-primary hover:bg-brand-primary hover:!text-white">
              Edit Time Slot
            </TodaiButton>
          }
          content={<TimeSlot />}
        />
      </div>
      {!isLoading && (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} //remove interaction plugin if not needed
          initialView="dayGridMonth"
          headerToolbar={{
            // left: 'prev,next today',
            left: "title",
            right: "prev,next today dayGridMonth,timeGridWeek,timeGridDay",
          }}
          // editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={availableSlots}
          // dateClick={handleDateClick}
          eventClick={handleEventClick}
          // eventDrop={handleEventDrop}
          themeSystem="litera"
          height="75vh"
          aspectRatio={1.8}
        />
      )}
      <ViewPost
        postId={(postDetails && postDetails[0]?.id) || 0}
        showPost={showPost}
        setShowPost={setShowPost}
        postText={(postDetails && postDetails[0]?.body) || ""}
        assetLink={(postDetails && postDetails[0]?.assets[0]?.asset) || ""}
        deletePostFromList={deletePostFromList}
      />
    </div>
  );
}

export default Calendar;

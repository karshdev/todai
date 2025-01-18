"use client"
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { postContentCalendar } from "@/lib/axios/api";
import { useMutation } from "@tanstack/react-query";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion } from "framer-motion";
import TodaiDialog from "@/components/dialog/TodaiDialog";
import { ShineBorder } from "@/components/card/ShineBoarder";


type ContentCalendar = {
  content: string;
  date: string;
  day: string;
  time: string;
  title: string;
};

function ContentCalendar() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<ContentCalendar[]>();
  const [selectedEvent, setSelectedEvent] = useState<ContentCalendar | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: () => postContentCalendar(),
    onSuccess: (response: any) => {
      const contentCalendarResponse = response?.data?.data?.content;
      if (contentCalendarResponse.length) {
        setCalendar(contentCalendarResponse);
      }
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "Please try again",
      });
    },
  });

  
  useEffect(() => {
    setLoading(true);
    mutate();
  }, []);

  const events = calendar?.map((item) => ({
    title: item.title,
    start: `${item.date}T${item.time}`,
    extendedProps: {
      content: item.content,
      day: item.day
    }
  }));

  const handleEventClick = (info: any) => {
    const eventData = {
      title: info.event.title,
      date: info.event.start.toISOString().split('T')[0],
      time: info.event.start.toISOString().split('T')[1].substring(0, 8),
      content: info.event.extendedProps.content,
      day: info.event.extendedProps.day
    };
    setSelectedEvent(eventData);
    setIsDialogOpen(true);
  };

  const EventContent = () => (
    <div className="p-6">
      <div className="text-lg font-semibold mb-4">
        {selectedEvent?.title}
      </div>
      <div className="text-sm text-gray-500 mb-4">
        {selectedEvent && new Date(`${selectedEvent.date}T${selectedEvent.time}`).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })}
      </div>
      <div className="text-gray-700 max-h-[60vh] overflow-y-auto">
        {selectedEvent?.content}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <TodaiCircularLoader />
      </div>
    );
  }

  return (
    <div className="p-4">
      <ShineBorder
        borderRadius={16}
        borderWidth={2}
        duration={10}
        color={["#3b82f6", "#60a5fa", "#93c5fd"]}
        className="w-full min-w-full p-6"
      >
        <div className="w-full overflow-x-auto">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth'
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            eventContent={(eventInfo) => (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-1 overflow-hidden"
              >
                <div className="text-sm font-medium truncate">
                  {eventInfo.event.title}
                </div>
                <div className="text-xs opacity-75">
                  {eventInfo.timeText}
                </div>
              </motion.div>
            )}
            eventClassNames="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-blue-500 text-white rounded"
          />
        </div>
      </ShineBorder>

      <TodaiDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        content={<EventContent />}
        dialogWidth="sm:max-w-[500px]"
      />
    </div>
  );
}

export default ContentCalendar;
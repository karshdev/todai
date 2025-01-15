import { TodaiButton } from "@/components/TodaiButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "flatpickr/dist/themes/light.css";
import { Trash2 } from "lucide-react";
import Flatpickr from "react-flatpickr";
import { DayData, ScheduleData } from "../types/type";

const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const ScheduleTable = ({ timeSlots, setTimeSlots }: any) => {
  if (!timeSlots) return <div>Loading</div>;

  const handleChangeTime = (index: any, selectedDates: any, dateStr: any) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index].time = dateStr;
    setTimeSlots(updatedTimeSlots);
  };

  const handleCheckboxChange = (slotIndex: any, dayIndex: any) => {
    const updatedTimeSlots = [...timeSlots];
    const dayId = dayIndex + 1;
    const slot = updatedTimeSlots[slotIndex];

    if (slot.days.some((d: DayData) => d.day.id === dayId)) {
      slot.days = slot.days.filter((d: any) => d.day.id !== dayId);
    } else {
      slot.days.push({ day: { id: dayId } });
    }

    setTimeSlots(updatedTimeSlots);
  };

  const handleDeleteSlot = (index: number) => {
    const updatedTimeSlots = timeSlots.filter((_: any, i: any) => i !== index);
    setTimeSlots(updatedTimeSlots);
  };

  // const handleUpdateSlot = () => {
  //     const newSlots = timeSlots.map((slot: ScheduleData) => {
  //         const [hours, minutes] = slot.time.split(":");
  //         const formattedTime = `${hours}:${minutes}`;

  //         return {
  //             time: formattedTime,
  //             days: slot.days.map((day: DayData) => day.day.id)
  //         };
  //     });
  //     const updateSlots = { slots: [...newSlots] }
  //     updateTimeSlot.mutate(updateSlots)
  // };

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-24 text-center">TIME</TableHead>
          {daysOfWeek.map((day) => (
            <TableHead key={day} className="text-center">
              {day}
            </TableHead>
          ))}
          <TableHead className="w-24 text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timeSlots.map((slot: any, slotIndex: number) => (
          <TableRow key={slotIndex}>
            <TableCell className="w-full">
              <Flatpickr
                data-enable-time
                data-no-calendar
                data-static
                value={slot?.time}
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
                onChange={(selectedDates, dateStr) =>
                  handleChangeTime(slotIndex, selectedDates, dateStr)
                }
                className="w-full p-2 border rounded font-bold text-center"
              />
            </TableCell>
            {daysOfWeek.map((day, dayIndex) => (
              <TableCell key={day} className="text-center">
                <Checkbox
                  checked={slot.days.some(
                    (d: any) => d.day.id === dayIndex + 1
                  )}
                  onCheckedChange={() =>
                    handleCheckboxChange(slotIndex, dayIndex)
                  }
                  className="mx-auto px-auto text-brand-primary"
                />
              </TableCell>
            ))}
            <TableCell className="text-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteSlot(slotIndex)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableRow></TableRow>
      {/* <TableRow>
                <TableCell colSpan={9} className="text-right">
                    <TodaiButton variant="primary-outline" className='hover:!text-white' onClick={handleUpdateSlot}>Update Slot</TodaiButton>
                </TableCell>
            </TableRow> */}
    </Table>
  );
};

export default ScheduleTable;

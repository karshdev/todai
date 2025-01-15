type Slot = {
    time: string;
    days: number[];
}

export type SlotsData = {
    slots: Slot[];
}

export type Day = {
    id: number;
    name: string;
};

export type DayData = {
    day: Day;
    timezone: string;
};

export type ScheduleData = {
    time: string;
    days: DayData[];
};
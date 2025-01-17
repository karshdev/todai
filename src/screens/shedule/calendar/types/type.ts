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

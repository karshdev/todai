import Calendar from "@/screens/schedule/calendar/Calendar"

function page() {
    return <>
        <div className='flex items-center flex-col my-1'>
            <p className='text-xs text-slate-500'>Schedule</p>
            <h1 className='text-3xl font-bold'>Calendar</h1>
        </div><Calendar /></>
}

export default page
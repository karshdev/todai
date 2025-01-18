import ContentCalendar from "@/screens/content-calendar/ContentCalendar";

function page() {
  return (
    <>
      <header className="container flex items-center flex-col mb-4 mt-2">
        <p className="text-xs text-slate-500">Ideate</p>
        <h1 className="text-3xl font-bold">Content  Calendar</h1>
        <div className="mt-2 text-sm max-w-4xl text-center text-slate-500">
        </div>
      </header>
      {/* <LinkedinRework /> */}
      <ContentCalendar />
    </>
  );
}

export default page;

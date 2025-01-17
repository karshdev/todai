import MyView from "@/screens/my-view/MyView";

function page() {
  return (
    <>
      <header className="container flex items-center flex-col mb-4">
        <p className="text-xs text-slate-500">Ideate</p>
        <h1 className="text-3xl font-bold">My View</h1>
        <div className="mt-2 text-sm max-w-4xl text-slate-500">
          <p>
            Want to express your view about things happening at the moment?
            Simply type in the box below to generate your view based on your
            profile settings.
          </p>
        </div>
      </header>
      <MyView />
    </>
  );
}

export default page;

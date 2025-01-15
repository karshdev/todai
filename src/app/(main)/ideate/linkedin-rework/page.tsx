import LinkedinRework from "@/screens/linkedin-rework/LinkedinRework";

function page() {
  return (
    <>
      <header className="container flex items-center flex-col mb-4 mt-2">
        <p className="text-xs text-slate-500">Ideate</p>
        <h1 className="text-3xl font-bold">Linkedin Rework</h1>
        <div className="mt-2 text-sm max-w-4xl text-center text-slate-500">
          <p>
          Paste the URL of a LinkedIn post that you like or would like to post about, we’ll grab the post and then you can rework the post with AI. Please ensure you paste a link to the post in the format https://www.linkedin.com/posts/xyz or use the “Copy link to post” option in LinkedIn to get the correct URL
          </p>
        </div>
      </header>
      <LinkedinRework />
    </>
  );
}

export default page;

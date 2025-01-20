import BlogScrapeAndPost from "@/screens/blog-scrape/BlogScrapeAndPost";

function page() {
  return (
    <>
      <header className="container flex items-center flex-col mb-4 mt-2">
        <p className="text-xs text-slate-500">Ideate</p>
        <h1 className="text-3xl font-bold">Blog Scrape & Rework</h1>
        <div className="mt-2 text-sm max-w-4xl text-center text-slate-500">
          <p>
            Paste the URL of a Blog post and you will to get AI auto generated caption and hashtags.
          </p>
        </div>
      </header>
      <BlogScrapeAndPost />
    </>
  );
}

export default page;

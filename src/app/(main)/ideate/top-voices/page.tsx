import TopVoices from "@/screens/top-voices/TopVoices";
import React from "react";

function page() {
  return (
    <>
      <header className="container flex items-center flex-col mb-6">
        <p className="text-xs text-slate-500">Ideate</p>
        <h1 className="text-3xl font-bold">Top Voices</h1>
        <div className="mt-2 text-sm text-slate-500">
          <p>
            Become a top voice for a topic that interests you. Find articles to
            collaborate on{" "}
            <span className="text-blue-600 underline">
              <a
                href="https://www.linkedin.com/pulse/topics/home/"
                target="_blank">
                here
              </a>
            </span>
            .{" "}
          </p>
        </div>
      </header>
      <TopVoices />
    </>
  );
}

export default page;

import BookSummary from "@/screens/book-summary/BookSummary";
import React from "react";

function page() {
  return (
    <>
      <header className="flex items-center flex-col mb-6">
        <p className="text-xs text-slate-500">Learn</p>
        <h1 className="text-3xl font-bold">Book Summary</h1>
        <div className="mt-2 text-sm max-w-4xl text-slate-500">
          <p>
            Input the title of any book you want to understand the key concepts
            for and we will return a summary with applications for you to read
            and takeaway to learn
          </p>
        </div>
      </header>
      <BookSummary />
    </>
  );
}

export default page;

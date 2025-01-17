import BookSummary from "@/screens/book-summary/BookSummary";
import Books from "@/screens/books/Books";
import React from "react";

function page() {
  return (
    <>
      <header className="flex items-center flex-col mb-6">
        <p className="text-xs text-slate-500">Ideate</p>
        <h1 className="text-3xl font-bold">Books</h1>
        <div className="mt-2 text-sm max-w-4xl text-center text-slate-500">
          <p>
            Insert the name of a book you have read or are inspired by in to the
            box below to create a summary post for your network
          </p>
        </div>
      </header>
      <Books />
    </>
  );
}

export default page;

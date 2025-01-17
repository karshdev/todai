import { TodaiImage } from "@/components/TodaiImage";
import React from "react";
import postReactions from "@/assets/img/post-reactions.svg";

function LinkedInPreviewFooter() {
  return (
    <div className="py-3 pl-4 pr-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <TodaiImage
            width={10}
            height={10}
            alt="post reactions"
            className="h-5 w-auto"
            src={postReactions}
          />
          <span className="mt-1 text-xs font-medium text-gray-500">
            Yara and 81 others
          </span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs font-medium text-gray-500">5 comments</span>
          <span className="text-xs font-medium text-gray-500">•</span>
          <span className="text-xs font-medium text-gray-500">2 repost</span>
        </div>
      </div>
      <hr className="mt-3 border-gray-200" />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center justify-center gap-1.5 rounded-lg px-1.5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 26 26"
            className="size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M22.75 10.563h-4.874v10.562h4.875a.812.812 0 0 0 .812-.813v-8.937a.812.812 0 0 0-.812-.813v0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m17.876 10.563-4.063-8.126a3.25 3.25 0 0 0-3.25 3.25v2.438H4.28a1.625 1.625 0 0 0-1.613 1.827l1.22 9.75a1.625 1.625 0 0 0 1.612 1.423h12.378"
            />
          </svg>
          Like
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-lg px-1.5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 26 26"
            className="size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.28 17.976a9.746 9.746 0 1 1 3.41 3.41h0l-3.367.962a.813.813 0 0 1-1.005-1.004l.963-3.368h0ZM10.417 11.375h6.5M10.417 14.625h6.5"
            />
          </svg>
          Comment
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-lg px-1.5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 26 26"
            className="size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m18.208 15.438 4.875-4.876-4.875-4.874"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3.583 20.313a9.75 9.75 0 0 1 9.75-9.75h9.75"
            />
          </svg>
          Share
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-lg px-1.5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 26 26"
            className="size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21.354 3.644 2.43 8.98a.812.812 0 0 0-.128 1.517l8.695 4.118c.17.08.306.217.387.387l4.118 8.695a.812.812 0 0 0 1.517-.128l5.337-18.924a.813.813 0 0 0-1.002-1.002ZM11.26 14.74l4.596-4.596"
            />
          </svg>
          Send
        </div>
      </div>
    </div>
  );
}

export default LinkedInPreviewFooter;

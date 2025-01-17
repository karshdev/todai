"use client"; // Important for client-side components in Next.js 14

import React, { useEffect } from "react";

// Replace with your actual Canny board token
const BOARD_TOKEN = process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN || "";

interface CannyRenderOptions {
  boardToken: string;
  basePath?: string | null;
  ssoToken?: string | null;
  theme?: "light" | "dark" | "auto";
}

const Feedback: React.FC = () => {
  useEffect(() => {
    // Canny SDK initialization function
    const initCanny = ({
      w,
      d,
      i,
      s,
    }: {
      w: Window;
      d: Document;
      i: string;
      s: string;
    }) => {
      function loadScript() {
        if (!d.getElementById(i)) {
          const firstScript = d.getElementsByTagName(s)[0];
          const cannyScript = d.createElement(s) as HTMLScriptElement;

          cannyScript.id = i;
          cannyScript.type = "text/javascript";
          cannyScript.async = true;
          cannyScript.src = "https://canny.io/sdk.js";

          firstScript.parentNode?.insertBefore(cannyScript, firstScript);
        }
      }

      if (typeof (w as any).Canny !== "function") {
        const c: any = function () {
          c.q.push(arguments);
        };
        c.q = [];
        (w as any).Canny = c;

        if (d.readyState === "complete") {
          loadScript();
        } else {
          w.addEventListener("load", loadScript, false);
        }
      }

      // Render Canny widget
      (w as any).Canny("render", {
        boardToken: BOARD_TOKEN,
        basePath: null, // Customize as needed
        ssoToken: null, // Add SSO token if using authentication
        theme: "light",
      });
    };

    // Call initialization with current window and document
    initCanny({
      w: window,
      d: document,
      i: "canny-jssdk",
      s: "script",
    });
  }, []);

  return <div data-canny className="w-full h-full" />;
};

export default Feedback;

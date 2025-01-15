"use client";

import React, { useEffect, useState } from "react";
import { getProfileData1 } from "@/lib/axios/api";
import { useRouter, usePathname } from "next/navigation";

const ProtectedLayout = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      try {
        const profile = await getProfileData1();
        const stepOn = profile?.data?.data?.step_on;
        console.log("🚀 ~ checkProfileAndRedirect ~ stepOn:", stepOn);

        switch (stepOn) {
          case "SUBSCRIPTION":
            router.push("/subscription");
            break;
          case "INTEREST":
            router.push("/onboarding");
            break;
          case "LINKEDINCONN":
            router.push("/connect-linkedIn");
            break;
          case "COMPLETED":
            if (pathname !== "/") {
              router.push(pathname);
            } else {
              setIsLoading(false);
              router.push("/help/features");
            }
            break;
          default:
            setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    const publicPaths = ["/signin", "/signup"];
    if (!publicPaths.includes(pathname)) {
      checkProfileAndRedirect();
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedLayout;

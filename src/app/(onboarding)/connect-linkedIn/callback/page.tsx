// "use client";
// import React, { useEffect } from "react";
// import dynamic from "next/dynamic";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useToast } from "@/components/ui/use-toast";
// import { connectWithLinkedIn } from "@/lib/axios/api";
// import useLocalStorage from "@/hooks/useLocalStorage";

// const LinkedInCallback: React.FC = () => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const searchParams = useSearchParams();
//   const code = searchParams.get("code");
//   const error = searchParams.get("error");
//   const [name, setName, removeName] = useLocalStorage("lastVisited", "");

//   useEffect(() => {
//     const connectLinkedIn = async () => {
//       if (code) {
//         try {
//           const data = { auth_code: code };
//           const response: any = await connectWithLinkedIn(data);
//           console.log("🚀 ~ connectLinkedIn ~ response:", response)
//           if (response.status === 200) {
//             toast({
//               title: response.data.status,
//               description: response.data.message,
//             });
//             // if (name == "/profile") router.push("/profile");
//             // else router.push("/onboarding");
//           }
//           // else {
//           //   toast({
//           //     title: "Failed to link LinkedIn profile",
//           //     description: "Please try again later.",
//           //   });
//           //   throw new Error("Unexpected response status");
//           // }
//         } catch (err) {
//           toast({
//             title: "Something went wrong! Please try again.",
//             description: "Linking LinkedIn profile failed.",
//           });
//           // router.push("/connect-linkedIn");
//         }
//       } else if (error) {
//         if (error === "user_cancelled_authorize") {
//           toast({
//             title: "LinkedIn connection failed",
//             description: "LinkedIn connection is required!",
//           });
//         } else {
//           toast({
//             title: "LinkedIn connection error",
//             description: "An unexpected error occurred.",
//           });
//         }
//         router.push("/connect-linkedIn");
//       }
//     };

//     connectLinkedIn();
//   }, [code]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="text-center">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//           LinkedIn Authentication in Progress...
//         </h2>
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//       </div>
//     </div>
//   );
// };

// const LinkedInCallbackWithSuspense = dynamic(
//   () => Promise.resolve(LinkedInCallback),
//   {
//     ssr: false,
//   }
// );

// export default function SuspenseWrapper() {
//   return (
//     <React.Suspense fallback={<div>Loading...</div>}>
//       <LinkedInCallbackWithSuspense />
//     </React.Suspense>
//   );
// }



"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { connectWithLinkedIn } from "@/lib/axios/api";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useQuery } from "@tanstack/react-query";

const LinkedInCallback: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");
  const error = searchParams.get("error");
  const [name] = useLocalStorage("lastVisited", "");
  const [code, setCode] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['linkedInConnect', code],
    queryFn: () => connectWithLinkedIn({ auth_code: code! }),
    enabled: !!code,
    retry: false,
  });

  // Handle success
  useEffect(() => {
    if (query.isSuccess && query.data) {
      toast({
        title: query.data.data.status,
        description: query.data.data.message,
      });
      setCode(null);
      router.push(name === "/profile" ? "/profile" : "/onboarding");
    }
  }, [query.isSuccess]);

  // Handle error
  useEffect(() => {
    if (query.isError) {
      toast({
        title: "Connection failed",
        description: "Unable to connect to LinkedIn. Please try again later.",
      });
      setCode(null);
      setTimeout(() => {
        router.push("/connect-linkedIn");
      }, 2000);
    }
  }, [query.isError]);

  // Handle URL parameters
  useEffect(() => {
    if (error) {
      const errorMessage =
        error === "user_cancelled_authorize"
          ? "LinkedIn connection is required!"
          : "An unexpected error occurred.";

      toast({
        title: "Connection failed",
        description: errorMessage,
      });
      setTimeout(() => {
        router.push("/connect-linkedIn");
      }, 2000);
      return;
    }

    // Set the code from URL parameter if not already set
    if (codeParam && !code) {
      setCode(codeParam);
    }
  }, [codeParam]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          LinkedIn Authentication in Progress...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

const LinkedInCallbackWithSuspense = dynamic(
  () => Promise.resolve(LinkedInCallback),
  {
    ssr: false,
  }
);

export default LinkedInCallbackWithSuspense;
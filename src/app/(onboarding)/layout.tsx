import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import QueryClientWrapperOnboarding from "./QueryClientWrapper";

export const metadata = {
  title: "Todai Onboarding",
  description: `It's time to use todai.`,
  icons: {
    icon: "/img/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientWrapperOnboarding>
          <Toaster />
          {children}
        </QueryClientWrapperOnboarding>
      </body>
    </html>
  );
}

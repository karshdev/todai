import BrevoWidget from "@/components/BrevoWidget";
import Header from "@/components/header/Header";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "./providers";
import QueryClientWrapper from "./QueryClientWrapper";
import SidebarWrapper from "./SidebarWrapper";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todai App",
  description: "It's time to use todai.",
  icons: {
    icon: "/img/favicon.ico",
  },
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { hideHeaderAndSidenav?: boolean };
}>) {
  const hideHeaderAndSidenav = params?.hideHeaderAndSidenav;

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientWrapper>
          <Providers>
            {/* <ProtectedLayout> */}
              {!hideHeaderAndSidenav && (
                <main className="">
                  <Header />
                  <SidebarWrapper>
                    <div className="p-4 mt-7 flex flex-col items-center">
                      {children}
                      <BrevoWidget />
                    </div>
                    <Toaster />
                  </SidebarWrapper>
                </main>
              )}
              {hideHeaderAndSidenav && children}
            {/* </ProtectedLayout> */}
          </Providers>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
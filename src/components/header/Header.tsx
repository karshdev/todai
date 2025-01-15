"use client";
import ProfileDropDown from "@/screens/home/components/ProfileDropDown";
import React from "react";
import { TodaiImage } from "../TodaiImage";
import { TodaiLink } from "../link";
import { useSession } from "next-auth/react";
import TodaiLogo from "@/assets/img/todailogobig.png";
import Link from "next/link";
import { MobileSideNav } from "@/screens/home/components/MobileSideNav";

function Header() {
  const { data } = useSession();
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <div
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
              <MobileSideNav />
            </div>
            <Link href="/" className="flex ms-2 md:me-24">
              <TodaiImage
                src={TodaiLogo}
                alt="TodaiImage"
                className="w-28 h-7 me-3"
                width={500}
                height={500}
              />
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              {data ? (
                <ProfileDropDown />
              ) : (
                <TodaiLink
                  href="signin"
                  className="text-center hover:bg-brand-secondary hover:text-brand-primary  w-full py-2 rounded-md flex flex-col items-center cursor-pointer">
                  <p className="text-sm">Sign In</p>
                </TodaiLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

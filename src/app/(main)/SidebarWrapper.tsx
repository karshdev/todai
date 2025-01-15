"use client";
import Sidenav from "@/screens/home/components/Sidenav";
import { ChevronLeftIcon, ChevronRight } from "lucide-react";
import React, { useState } from "react";

type SidebarWrapperProps = {
  children: React.ReactNode;
};

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      <div
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen pt-20 transition-all duration-300 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 hidden md:block ${
          isCollapsed ? "w-16" : "w-64"
        } ${
          isCollapsed
            ? "sm:translate-x-0"
            : "sm:translate-x-0 -translate-x-full"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Sidebar">
        <div className={`h-full px-0.5 pb-4 overflow-y-auto dark:bg-gray-800  ${isCollapsed ? "flex justify-center" : ""}`}>
          <Sidenav isCollapsed={isCollapsed} />
          <div
            className={`absolute top-16 -right-2.5 cursor-pointer transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            onClick={toggleSidebar}>
            {isCollapsed ? (
              <ChevronRight className="bg-white border border-[#e5e7eb] rounded-full text-slate-600 h-5 w-5 hover:bg-slate-300 shadow-md" />
            ) : (
              <ChevronLeftIcon className="bg-white border border-[#e5e7eb] rounded-full text-slate-600 h-5 w-5 hover:bg-slate-300 shadow-md" />
            )}
          </div>
          
        </div>
      </div>
      <div
        className={`p-4 transition-all duration-300 ${
          isCollapsed ? "sm:ml-16" : "sm:ml-64"
        }`}>
        {children}
      </div>
    </>
  );
};

export default SidebarWrapper;

"use client";
import FeatureRequest from "@/assets/img/feature-request.svg";
import TodaiCollapsible from "@/components/collapsible/TodaiCollapsible";
import TodaiIcon from "@/components/icon/TodaiIcon";
import { TodaiImage } from "@/components/TodaiImage";
import TodaiTooltip from "@/components/tooltip";
import { useProfile } from "@/hooks/useProfile";
import menuList from "@/lib/menuList.json";
import {
  IconBook,
  IconBook2,
  IconBookmarkEdit,
  IconBooks,
  IconBrandLinkedin,
  IconCalendar,
  IconCalendarClock,
  IconCarouselHorizontal,
  IconEye,
  IconFileTextAi,
  IconInfoSquareRounded,
  IconPlayerPlay,
  IconQuote,
  IconSpeakerphone,
  IconWorld
} from "@tabler/icons-react";
import { Lightbulb, Plus, Subtitles } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Lightbulb: Lightbulb,
  Plus: Plus,
  IconPlayerPlay: IconPlayerPlay,
  IconBrandLinkedin: IconBrandLinkedin,
  IconFileTextAi: IconFileTextAi,
  IconWorld: IconWorld,
  IconQuote: IconQuote,
  IconCalendar: IconCalendar,
  IconCalendarClock: IconCalendarClock,
  IconSpeakerphone: IconSpeakerphone,
  IconCarouselHorizontal: IconCarouselHorizontal,
  IconEye: IconEye,
  IconBook: IconBook,
  IconBooks: IconBooks,
  IconBook2: IconBook2,
  IconBookmarkEdit: IconBookmarkEdit,
  Subtitles: Subtitles,
};

export type MenuItem = {
  id: number;
  name: string;
  href: string;
  icon: string;
  subMenu?: MenuItem[];
};

type SidenavProps = {
  isCollapsed: boolean;
};

type ApiResponse = {
  status: string;
  data: {
    app_routes: string[];
  };
};

function filterMenuByRoutes(
  menuList: MenuItem[],
  allowedRoutes: string[]
): MenuItem[] {
  return menuList.reduce((acc: MenuItem[], menuItem) => {
    if (menuItem.subMenu) {
      const filteredSubMenu = menuItem.subMenu.filter(
        (subItem) =>
          allowedRoutes.includes(subItem.href)
      );

      if (filteredSubMenu.length > 0) {
        acc.push({
          ...menuItem,
          subMenu: filteredSubMenu,
        });
      }
    } else if (menuItem.href && allowedRoutes.includes(menuItem.href)) {
      acc.push(menuItem);
    }
    return acc;
  }, []);
}

function Sidenav({ isCollapsed }: SidenavProps) {
  const [filteredMenu, setFilteredMenu] = useState<any>(menuList);
  const { data } = useProfile();
  useEffect(() => {
    getRoutes();
  }, [data]);
  const getRoutes = () => {
    try {
      const filteredMenuList = filterMenuByRoutes(menuList, data.app_routes);
      setFilteredMenu(filteredMenuList);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setFilteredMenu(menuList);
    }
  };
  const mappedMenuList = filteredMenu.map((item: MenuItem) => ({
    ...item,
    icon: React.createElement(iconMap[item.icon], {
      className: `text-slate-700 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`,
    }),
    name: isCollapsed ? "" : item.name,
    subMenu: item.subMenu
      ? item.subMenu.map((subItem: MenuItem) => ({
          ...subItem,
          icon: React.createElement(iconMap[subItem.icon], {
            className: `text-gray-700 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`,
          }),
          name: isCollapsed ? "" : subItem.name,
        }))
      : [],
  }));

  return (
    <div className={`space-y-4 font-medium relative ${isCollapsed ? "px-2" : "px-4"}`}>
      <TodaiCollapsible
        collapsibleList={mappedMenuList}
        isCollapsed={isCollapsed}
      />
      <div
        className={` p-2  pb-4 flex gap-2 bg-white ${
          isCollapsed
            ? "flex-col justify-center items-center"
            : "flex-row justify-start left-0 right-0"
        }`}>
        <TodaiTooltip
          triggerContent={
            <Link href="/help/features">
              <TodaiIcon>
                <IconInfoSquareRounded stroke={1} />
              </TodaiIcon>
            </Link>
          }
          delayDuration={0}
          tooltipContent={<p className="text-xs">Features</p>}
        />
        <TodaiTooltip
          triggerContent={
            <Link href="/feature-request">
              <TodaiImage
                src={FeatureRequest}
                alt="Feature Request"
                width={20}
                height={20}
                className="text-slate-300"
              />
            </Link>
          }
          delayDuration={0}
          tooltipContent={<p className="text-xs">Feature Request</p>}
        />
      </div>
    </div>
  );
}

export default Sidenav;

// import React, { useEffect, useState } from "react";
// import { X, Lightbulb, Plus } from "lucide-react";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import menuList from "@/lib/menuList.json";
// import TodaiCollapsible from "@/components/collapsible/TodaiCollapsible";
// import { useProfile } from "@/hooks/useProfile";
// import { MenuItem } from "./Sidenav";

// const iconMap: any = {
//   Lightbulb: Lightbulb,
//   Plus: Plus,
// };

// export const MobileSideNav = ({ isCollapsed = false }: any) => {
//   //   const mappedMenuList = menuList.map((item) => ({
//   //     ...item,
//   //     icon: React.createElement(iconMap[item.icon], {
//   //       className: "text-slate-300",
//   //     }),
//   //   }));
//   const [filteredMenu, setFilteredMenu] = useState<any>(menuList);
//   const { data } = useProfile();
//   useEffect(() => {
//     getRoutes();
//   }, [data]);
//   const getRoutes = () => {
//     try {
//       const filteredMenuList = filterMenuByRoutes(menuList, data.app_routes);
//       setFilteredMenu(filteredMenuList);
//     } catch (error) {
//       console.error("Error fetching routes:", error);
//       setFilteredMenu(menuList);
//     }
//   };
//   const mappedMenuList = filteredMenu.map((item: MenuItem) => ({
//     ...item,
//     icon: React.createElement(iconMap[item.icon], {
//       className: `text-slate-700 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`,
//     }),
//     name: isCollapsed ? "" : item.name,
//     subMenu: item.subMenu
//       ? item.subMenu.map((subItem: MenuItem) => ({
//           ...subItem,
//           icon: React.createElement(iconMap[subItem.icon], {
//             className: `text-gray-700 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`,
//           }),
//           name: isCollapsed ? "" : subItem.name,
//         }))
//       : [],
//   }));
//   return (
//     <Drawer direction="left">
//       <DrawerTrigger>
//         <svg
//           className="w-6 h-6"
//           aria-hidden="true"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg">
//           <path
//             clipRule="evenodd"
//             fillRule="evenodd"
//             d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
//         </svg>
//       </DrawerTrigger>
//       <DrawerContent className="h-screen w-[70%] rounded-e-md !rounded-s-none">
//         <DrawerHeader>
//           <DrawerClose className="w-full">
//             <X className="float-end" />
//           </DrawerClose>
//         </DrawerHeader>
//         <div className="p-5 space-y-4 font-medium">
//           {mappedMenuList && (
//             <TodaiCollapsible collapsibleList={mappedMenuList} />
//           )}
//         </div>
//         <DrawerFooter>{/* Commented out footer content */}</DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// function filterMenuByRoutes(
//   menuList: MenuItem[],
//   allowedRoutes: string[]
// ): MenuItem[] {
//   return menuList.reduce((acc: MenuItem[], menuItem) => {
//     if (menuItem.subMenu) {
//       const filteredSubMenu = menuItem.subMenu.filter(
//         (subItem) =>
//           // allowedRoutes.includes(subItem.href)
//           allowedRoutes.includes(subItem.href) ||
//           subItem.href === "/create/subtitles"
//       );

//       if (filteredSubMenu.length > 0) {
//         acc.push({
//           ...menuItem,
//           subMenu: filteredSubMenu,
//         });
//       }
//     } else if (menuItem.href && allowedRoutes.includes(menuItem.href)) {
//       acc.push(menuItem);
//     }
//     return acc;
//   }, []);
// }

import FeatureRequest from "@/assets/img/feature-request.svg";
import TodaiCollapsible from "@/components/collapsible/TodaiCollapsible";
import TodaiIcon from "@/components/icon/TodaiIcon";
import { TodaiImage } from "@/components/TodaiImage";
import TodaiTooltip from "@/components/tooltip";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useProfile } from "@/hooks/useProfile";
import menuList from "@/lib/menuList.json";
import {
  IconBadgeCc,
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
  IconWorld,
} from "@tabler/icons-react";
import { Lightbulb, Plus, Subtitles, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type IconName =
  | "Lightbulb"
  | "Plus"
  | "IconPlayerPlay"
  | "IconBrandLinkedin"
  | "IconFileTextAi"
  | "IconWorld"
  | "IconQuote"
  | "IconCalendar"
  | "IconCalendarClock"
  | "IconSpeakerphone"
  | "IconCarouselHorizontal"
  | "IconEye"
  | "IconBook"
  | "IconBooks"
  | "IconBook2"
  | "IconBookmarkEdit"
  | "Subtitles"
  | "IconBadgeCc"
  | "IconInfoSquareRounded";

interface MenuItem {
  id: number;
  name: string;
  icon: IconName;
  href: string;
  order?: number;
  subMenu?: MenuItem[];
}

const iconMap: Record<IconName, React.ComponentType<any>> = {
  Lightbulb,
  Plus,
  IconPlayerPlay,
  IconBrandLinkedin,
  IconFileTextAi,
  IconWorld,
  IconQuote,
  IconCalendar,
  IconCalendarClock,
  IconSpeakerphone,
  IconCarouselHorizontal,
  IconEye,
  IconBook,
  IconBooks,
  IconBook2,
  IconBookmarkEdit,
  Subtitles,
  IconBadgeCc,
  IconInfoSquareRounded,
};

export const MobileSideNav = ({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) => {
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const { data } = useProfile();

  useEffect(() => {
    getRoutes();
  }, [data]);

  const getRoutes = () => {
    try {
      const filteredMenuList = filterMenuByRoutes(
        menuList as MenuItem[],
        data.app_routes
      );
      setFilteredMenu(filteredMenuList);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setFilteredMenu(menuList as MenuItem[]);
    }
  };

  const mappedMenuList = filteredMenu.map((item) => {
    const IconComponent = iconMap[item.icon as IconName];

    return {
      ...item,
      icon: IconComponent ? (
        <IconComponent
          className={`text-slate-700 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`}
        />
      ) : null,
      name: isCollapsed ? "" : item.name,
      subMenu: item.subMenu
        ? item.subMenu.map((subItem) => {
            const SubIconComponent = iconMap[subItem.icon as IconName];
            return {
              ...subItem,
              icon: SubIconComponent ? (
                <SubIconComponent
                  className={`text-gray-700 ${
                    isCollapsed ? "w-6 h-6" : "w-5 h-5"
                  }`}
                />
              ) : null,
              name: isCollapsed ? "" : subItem.name,
            };
          })
        : [],
    };
  });

  return (
    <Drawer direction="left">
      <DrawerTrigger>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </DrawerTrigger>
      <DrawerContent className="h-screen w-[70%] rounded-e-md !rounded-s-none">
        <DrawerHeader>
          <DrawerClose className="w-full">
            <X className="float-end" />
          </DrawerClose>
        </DrawerHeader>
        <div className="p-5 space-y-4 font-medium h-screen overflow-y-auto">
          {mappedMenuList && (
            <TodaiCollapsible collapsibleList={mappedMenuList} />
          )}
          <div
            className={`absolute bottom-0 p-2  pb-4 flex gap-2 bg-white justify-start items-center`}>
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
        <DrawerFooter>{/* Footer content */}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
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

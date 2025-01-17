'use client'
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TodaiTooltip from "../tooltip";

type CollapsibleItem = {
  id: number;
  name: string;
  href?: string;
  icon?: React.ReactNode;
  subMenu?: CollapsibleItem[];
};

type CollapsibleProps = {
  collapsibleList: CollapsibleItem[];
  isCollapsed?: boolean;
};

const CollapsibleItemComponent: React.FC<{
  item: CollapsibleItem;
  isCollapsed: boolean;
}> = ({ item, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(!isCollapsed);
  const pathname = usePathname();

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Collapsible key={item.id} open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        //  onClick={toggleCollapsible}
        className={`text-xl font-bold border-b w-full flex ${
          isCollapsed ? "justify-center" : "justify-between"
        } items-center`}>
        <div
          className={`flex gap-2 items-center text-slate-900 ${
            isCollapsed ? "justify-center" : ""
          }`}>
          {item.icon}
          {!isCollapsed && item.name}
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: !isOpen ? -180 : 0 }}
            transition={{ duration: 0.3 }}>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.3 },
                opacity: { duration: 0.3 },
              }}
              style={{ overflow: "hidden" }} // Ensure the overflow is hidden to avoid content spill
            >
              <ul className="text-xs my-2 w-full">
                {item.subMenu?.map((subItem) => (
                  <div
                    key={subItem.id}
                    className={`flex flex-col gap-1 my-1 w-full ${
                      pathname === subItem.href &&
                      "bg-slate-400 rounded-md bg-opacity-50"
                    }`}>
                    {isCollapsed && (
                      <TodaiTooltip
                        tooltipContent={subItem.name}
                        triggerContent={
                          <Link
                            href={subItem.href || "#"}
                            className="hover:bg-slate-200 p-2 rounded-md font-semibold flex items-center text-black">
                            {subItem.icon}
                          </Link>
                        }
                        delayDuration={500}
                        dataSide="right"
                      />
                    )}
                    {!isCollapsed && (
                      <Link
                        href={subItem.href || "#"}
                        className="hover:bg-slate-200 p-2 rounded-md font-semibold flex items-center">
                        {subItem.icon}
                        {!isCollapsed && subItem.name}
                      </Link>
                    )}
                  </div>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

const TodaiCollapsible: React.FC<CollapsibleProps> = ({
  collapsibleList,
  isCollapsed = false,
}) => {
  return (
    <>
      {collapsibleList.map((collapsible) => (
        <CollapsibleItemComponent
          key={collapsible.id}
          item={collapsible}
          isCollapsed={isCollapsed}
        />
      ))}
    </>
  );
};

export default TodaiCollapsible;

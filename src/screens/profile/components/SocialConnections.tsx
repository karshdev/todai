import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import TodaiIcon from "@/components/icon/TodaiIcon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconRepeat } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import linkedInIcon from "@/assets/img/linkedin.svg";
import { TodaiImage } from "@/components/TodaiImage";
import useLocalStorage from "@/hooks/useLocalStorage";
import { fetchLinkedInStatus } from "@/lib/axios/api";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

function SocialConnections() {
  const [name, setName, removeName] = useLocalStorage("lastVisited", "");
  const router = useRouter();

  const handleLinkedInConnect = () => {
    // setName("/profile");
    localStorage.setItem("lastVisited", "/profile");
    router.push("/connect-linkedIn");
  };

  const { data: liStatus } = useQuery({
    queryKey: ["socialConnections"],
    queryFn: () => fetchLinkedInStatus({ content: "" }),
  });

  return (
    <div className="container gap-6 bg-white w-full border-t py-5">
      <div>
        <h3 className="text-base font-semibold ">Linked Channels</h3>
        <p className="text-xs text-gray-600">
          View and manage your social connections.
        </p>
      </div>
      <Table className="max-w-3xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] ">Channel</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:!bg-white">
            <TableCell className="font-medium text-center">
              {" "}
              <span className=" text-sm font-medium text-gray-700 mb-1 flex items-center ">
                <TodaiImage
                  src={linkedInIcon}
                  className="w-8 h-8"
                  height={100}
                  width={100}
                  alt="linkedIn"
                />
                LinkedIn
              </span>
            </TableCell>
            <TableCell className="text-center">
              <span
                className={cn(
                  "text-xs font-medium me-2 px-2.5 py-0.5 rounded border",
                  {
                    "bg-green-100 text-green-800 dark:bg-gray-700 dark:text-green-400 border-green-400":
                      liStatus?.linkedin_active === true,
                    "bg-red-100 text-red-800 dark:bg-gray-700 dark:text-red-400 border-red-400":
                      liStatus?.linkedin_active === false,
                  }
                )}>
                {liStatus?.linkedin_active ? "Connected" : "Not connected"}
              </span>
            </TableCell>
            <TableCell className="text-center flex justify-center">
              <TodaiAnimatedButton
                onClick={handleLinkedInConnect}
                variant="primary"
                type="button"
                className=" shadow-md !text-xs text-red-400 mb-1 bg-red-100 hover:bg-red-100 w-fit py-1 rounded-full flex items-center ">
                <IconRepeat className="text-red-400 w-5 h-5" />
                Reconnect
              </TodaiAnimatedButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default SocialConnections;

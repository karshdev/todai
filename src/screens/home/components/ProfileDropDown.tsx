"use client";
import dummyavatar from "@/assets/img/avatar-dummy.jpeg";
import { TodaiImage } from "@/components/TodaiImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ProfileDropDown() {
  const router = useRouter();
  const { data: profileInfo } = useProfile();
  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TodaiImage
          className="w-8 h-8 rounded-full object-cover"
          src={profileInfo?.image || dummyavatar}
          alt="profile img"
          width={100}
          height={100}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" mr-2 w-44">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p>
              Hey 👋🏻, {profileInfo?.first_name} {profileInfo?.last_name}
            </p>{" "}
            <p className="text-[10px] text-slate-500"> {profileInfo?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            Profile
          </DropdownMenuItem>
        </Link>
        {/* <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropDown;

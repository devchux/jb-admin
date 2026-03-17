/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Search, Bell, LogOutIcon } from "lucide-react";
import Image from "next/image";
import { Switch } from "./ui/switch";
import { MoreHorizontal } from "lucide-react";
import { useStore } from "@/store";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRouter } from "next/navigation";

const DashboardTopBar = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const user = useStore((state) => state.user);
  const reset = useStore((state) => state.reset);
  const router = useRouter();

  const handleLogout = () => {
    reset();
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-none px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Admin Portal */}
        <div className="flex items-center space-x-4">
          {/* Logo image */}
          <Image
            width={56}
            height={61}
            src={"/images/logo.png"}
            alt="Jaiz Bank Logo"
            // className="w-14 h-14 rounded-full"
          />

          {/* Admin Portal indicator */}
          <div className="flex items-center p-2 w-[145.42] h-[40] bg-white rounded-full border border-[#D9F0E2]">
            {/* ShadCN Toggle Switch */}
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              // thumbClassName="bg-[#27AE60]"
              className="h-6 w-[35] data-[state=checked]:bg-[#D9F0E2] data-[state=unchecked]:bg-gray-300 border-2 data-[state=checked]:border-[#D9F0E2] data-[state=unchecked]:border-gray-300"
            />

            {/* Admin Portal Text */}
            <div className="text-xs font-medium pl-2 text-gray-800">
              Admin Portal
            </div>
          </div>
        </div>

        {/* Right side - Search, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
            {/* Search Icon */}
            <div className="flex items-center justify-center w-[56] h-[56] border border-[#F3F3F3] bg-white rounded-xl cursor-pointer">
              <Search className="w-6 h-6 text-[#4C4C4C]" strokeWidth={1.5} />
            </div>

            {/* Notification Bell with Badge */}
            <div className="relative flex items-center justify-center w-[56] h-[56] border ml-6 border-[#F3F3F3] bg-white rounded-sm cursor-pointer">
              <Bell className="w-6 h-6 text-black" strokeWidth={1.5} />
              <div className="absolute top-3 right-4 bg-gray-800 text-white text-[6px] font-semibold rounded-full w-3 h-3 flex items-center justify-center">
                10
              </div>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center justify-between space-x-4 bg-[#E7ECF2] rounded-full p-2 pr-4 ml-6 w-[300] ">
              <div className="flex flex-row items-center space-x-2">
                {/* Profile Image */}
                <div className="w-[50] h-[47] rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="user-photo"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900 font-sans">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    {user?.role?.name}
                  </p>
                </div>
              </div>
              {/* More Options Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center justify-center w-6 h-6 bg-blue-900 rounded-full cursor-pointer">
                    <MoreHorizontal
                      className="w-4 h-4 text-white"
                      strokeWidth={1.5}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                    >
                      <LogOutIcon className="size-4" /> Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;

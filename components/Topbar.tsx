/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Search, Bell, KeyRound, LogOutIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { MoreHorizontal } from "lucide-react";
import { useStore } from "@/store";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRouter } from "next/navigation";
import ChangePassword from "./modals/ChangePassword";
import { SidebarTrigger } from "./ui/sidebar";

const DashboardTopBar = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const user = useStore((state) => state.user);
  const reset = useStore((state) => state.reset);
  const router = useRouter();

  const handleLogout = () => {
    reset();
    router.push("/");
  };

  return (
    <header className="border-b border-[#EDF0F4] bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Admin Portal */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="size-9 rounded-lg border border-[#EDF0F4] text-slate-600 hover:bg-slate-50" />
          {/* Admin Portal indicator */}
          <div className="hidden items-center rounded-full border border-[#D9F0E2] bg-white p-2 sm:flex">
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
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-between">
            {/* Search Icon */}
            <div className="hidden size-11 items-center justify-center rounded-xl border border-[#F3F3F3] bg-white sm:flex">
              <Search className="w-6 h-6 text-[#4C4C4C]" strokeWidth={1.5} />
            </div>

            {/* Notification Bell with Badge */}
            <div className="relative flex size-11 items-center justify-center rounded-xl border border-[#F3F3F3] bg-white">
              <Bell className="w-6 h-6 text-black" strokeWidth={1.5} />
              <div className="absolute right-2.5 top-2 flex size-3 items-center justify-center rounded-full bg-gray-800 text-[6px] font-semibold text-white">
                10
              </div>
            </div>

            {/* User Profile Section */}
            <div className="ml-3 flex items-center justify-between gap-3 rounded-full bg-[#E7ECF2] p-1.5 sm:min-w-[250px] sm:pr-3">
              <div className="flex flex-row items-center gap-2">
                {/* Profile Image */}
                <div className="size-10 overflow-hidden rounded-full">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="user-photo"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="hidden text-left sm:block">
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
                      onClick={() => setChangePasswordOpen(true)}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                    >
                      <KeyRound className="size-4" /> Change Password
                    </button>
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

      <ChangePassword
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </header>
  );
};

export default DashboardTopBar;

"use client";
import AdminAccessMetrics from "@/components/dashboard/AdminAccessMetrics";
import AllUsersTable from "@/components/tables/AllUsersTable";
import RolesPermissionsTable from "@/components/tables/RolesPermissionTable";
import React, { useState } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("all-admin-users");

  const tabs = [
    { id: "all-admin-users", label: "All Admin Users" },
    { id: "roles-permissions", label: "Roles and Permissions" },
  ];

  type Tab = { id: string; label: string };
  type NavSectionProps = {
    tabs: Tab[];
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  };

  const NavSection: React.FC<NavSectionProps> = ({
    tabs,
    activeTab,
    setActiveTab,
  }) => (
    <nav className="flex space-2 flex-wrap mb-6 bg-[#E7ECF2] p-2 rounded-full ">
      {tabs.map((tab) => (
        <div className="flex items-center" key={tab.id}>
          <button
            className={`px-6 py-[11px] rounded-full text-sm  ${
              activeTab === tab.id
                ? "bg-[#193F7F] text-white font-semibold"
                : " text-[#193F7F]"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <AdminAccessMetrics type="admins" />
      {/* Navigation Section */}
      <NavSection
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Content Section */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        {activeTab === "all-admin-users" && <AllUsersTable />}
        {activeTab === "roles-permissions" && <RolesPermissionsTable />}
      </div>
    </>
  );
};

export default Page;

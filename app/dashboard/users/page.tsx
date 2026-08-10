"use client";
import AdminAccessMetrics from "@/components/dashboard/AdminAccessMetrics";
import AllAppUsersTable from "@/components/tables/AllAppUsersTable";
import AllUsersTable from "@/components/tables/AllUsersTable";
import AuditLog from "@/components/tables/AuditLog";
import RolesPermissionsTable from "@/components/tables/RolesPermissionTable";
import React, { useState } from "react";
import AccountActivityTable from "@/components/tables/AccountActivityTable";

const Page = () => {
  const [activeTab, setActiveTab] = useState("all-admin-users");

  const tabs = [
    { id: "all-users", label: "All App Users" },
    { id: "all-admin-users", label: "All Admin Users" },
    { id: "roles-permissions", label: "Roles and Permissions" },
    { id: "audit-logs", label: "Audit Logs" },
    { id: "new-registrations", label: "New Registrations" },
    { id: "pending-first-login", label: "Pending First Login" },
    { id: "device-registrations", label: "Device Registrations" },
    { id: "account-creations", label: "Account Creations" },
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
      <AdminAccessMetrics />
      {/* Navigation Section */}
      <NavSection
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Content Section */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        {activeTab === "all-admin-users" && <AllUsersTable />}
        {activeTab === "all-users" && <AllAppUsersTable />}
        {activeTab === "roles-permissions" && <RolesPermissionsTable />}
        {activeTab === "audit-logs" && <AuditLog />}
        {activeTab === "new-registrations" && (
          <AccountActivityTable kind="registrations" />
        )}
        {activeTab === "pending-first-login" && (
          <AccountActivityTable kind="pending-login" />
        )}
        {activeTab === "device-registrations" && (
          <AccountActivityTable kind="devices" />
        )}
        {activeTab === "account-creations" && (
          <AccountActivityTable kind="accounts" />
        )}
      </div>
    </>
  );
};

export default Page;

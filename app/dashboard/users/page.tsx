"use client";
import AdminAccessMetrics from "@/components/dashboard/AdminAccessMetrics";
import AllAppUsersTable from "@/components/tables/AllAppUsersTable";
import AuditLog from "@/components/tables/AuditLog";
import React, { useEffect, useState } from "react";
import AccountActivityTable from "@/components/tables/AccountActivityTable";
import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/lib/constants";

const Page = () => {
  const [activeTab, setActiveTab] = useState("all-users");
  const { hasPermission } = usePermissions();

  const tabs = ([
    { id: "all-users", label: "All App Users", permission: "user:read" },
    { id: "audit-logs", label: "Audit Logs", permission: "audit:read" },
    { id: "new-registrations", label: "New Registrations", permission: "user:read" },
    { id: "pending-first-login", label: "Pending First Login", permission: "user:read" },
    { id: "device-registrations", label: "Device Registrations", permission: "user:read" },
    { id: "account-creations", label: "Account Creations", permission: "user:read" },
  ] satisfies Array<{ id: string; label: string; permission: Permission }>).filter(
    (tab) => hasPermission(tab.permission),
  );

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab) && tabs[0]) {
      setActiveTab(tabs[0].id);
    }
  }, [activeTab, tabs]);

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
      <AdminAccessMetrics type="users" />
      {/* Navigation Section */}
      <NavSection
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Content Section */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        {activeTab === "all-users" && <AllAppUsersTable />}
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

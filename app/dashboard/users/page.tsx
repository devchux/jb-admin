'use client';
import AllUsersTable from '@/components/tables/AllUsersTable';
import AuditLog from '@/components/tables/AuditLog';
import RolesPermissionsTable from '@/components/tables/RolesPermissionTable';
import React, { useState } from 'react';

const Page = () => {
  const [activeTab, setActiveTab] = useState('all-users');

  const tabs = [
    { id: 'all-users', label: 'All Users' },
    { id: 'roles-permissions', label: 'Roles and Permissions' },
    { id: 'audit-logs', label: 'Audit Logs' },
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
    <nav className="flex space-x-4 mb-6 bg-[#E7ECF2] p-2 rounded-full ">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-6 py-[11px] rounded-full text-sm  ${
            activeTab === tab.id
              ? 'bg-[#193F7F] text-white font-semibold'
              : ' text-[#193F7F]'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Navigation Section */}
      <NavSection
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Content Section */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        {activeTab === 'all-users' && <AllUsersTable />}
        {activeTab === 'roles-permissions' && <RolesPermissionsTable />}
        {activeTab === 'audit-logs' && <AuditLog />}
      </div>
    </>
  );
};

export default Page;

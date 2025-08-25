'use client';
import BroadcastHistory from '@/components/tables/notifications/History';
import Notifications from '@/components/tables/notifications/Notifications';
import React, { useState } from 'react';

const Page = () => {
  const [activeTab, setActiveTab] = useState('history');

  const tabs = [
    { id: 'history', label: 'Broadcast History', count: 120 },
    {
      id: 'notifications',
      label: 'My Notifications',
      count: 10,
    },
  ];

  type Tab = { id: string; label: string; count: number };
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
        <div className="flex items-center" key={tab.id}>
          <button
            className={`px-6 py-[11px] rounded-full text-sm  ${
              activeTab === tab.id
                ? 'bg-[#193F7F] text-white font-semibold'
                : ' text-[#193F7F]'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span
                className={`ml-1 text-[#fff] px-2 py-1 rounded-full text-xs font-medium`}
              >
                {tab.count}
              </span>
            )}
          </button>
          {activeTab !== tab.id && (
            <span className={` text-[#8D8D8D]  text-xs font-medium`}>
              {tab.count}
            </span>
          )}
        </div>
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
        {activeTab === 'notifications' && <Notifications />}
        {activeTab === 'history' && <BroadcastHistory />}
      </div>
    </>
  );
};

export default Page;

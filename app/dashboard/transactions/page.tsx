'use client';
import CardPOS from '@/components/tables/transactions/CardPOS';
import JaizToJaiz from '@/components/tables/transactions/JaizToJaiz';
import JaizToOthers from '@/components/tables/transactions/JaiztoOthers';
import OnlinePay from '@/components/tables/transactions/OnlinePay';
import Ussd from '@/components/tables/transactions/Ussd';
import React, { useState } from 'react';

const page = () => {
  const [activeTab, setActiveTab] = useState('jaiz-to-jaiz');

  const tabs = [
    { id: 'jaiz-to-jaiz', label: 'Jaiz to Jaiz Transfers', count: 120 },
    {
      id: 'jaiz-to-other-banks',
      label: 'Jaiz to Other Banks Transfers',
      count: 120,
    },
    { id: 'card-pos', label: 'Card POS Transactions', count: 345 },
    { id: 'online-payments', label: 'Online Payments', count: 200 },
    { id: 'ussd-transactions', label: 'USSD Transactions', count: 200 },
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
        {activeTab === 'jaiz-to-jaiz' && <JaizToJaiz />}
        {activeTab === 'jaiz-to-other-banks' && <JaizToOthers />}
        {activeTab === 'card-pos' && <CardPOS />}
        {activeTab === 'online-payments' && <OnlinePay />}
        {activeTab === 'ussd-transactions' && <Ussd />}
      </div>
    </>
  );
};

export default page;

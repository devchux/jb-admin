"use client";
import AirtimeDataTransactions from "@/components/tables/transactions/AirtimeData";
import ElectricityTransactions from "@/components/tables/transactions/Electricity";
import JaizToJaiz from "@/components/tables/transactions/JaizToJaiz";
import JaizToOthers from "@/components/tables/transactions/JaiztoOthers";
import MobilePayments from "@/components/tables/transactions/MobilePayment";
import NQRTransactions from "@/components/tables/transactions/NQR";
import OmniPayments from "@/components/tables/transactions/OmniPayment";
import React, { useState } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("jaiz-to-jaiz");

  const tabs = [
    { id: "jaiz-to-jaiz", label: "Jaiz to Jaiz Transfers", count: 0 },
    {
      id: "jaiz-to-other-banks",
      label: "Jaiz to Other Banks Transfers",
      count: 0,
    },
    { id: "omni-payments", label: "Omni Bill Payments", count: 0 },
    { id: "mobile-payments", label: "Mobile Bill Payments", count: 0 },
    {
      id: "electricity-transactions",
      label: "Electricity",
      count: 0,
    },
    {
      id: "nqr-transactions",
      label: "NQR",
      count: 0,
    },
    {
      id: "airtime-data",
      label: "Airtime & Data",
      count: 0,
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
                ? "bg-[#193F7F] text-white font-semibold"
                : " text-[#193F7F]"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && tab.count > 0 && (
              <span
                className={`ml-1 text-[#fff] px-2 py-1 rounded-full text-xs font-medium`}
              >
                {tab.count}
              </span>
            )}
          </button>
          {activeTab !== tab.id && tab.count > 0 && (
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
        {activeTab === "jaiz-to-jaiz" && <JaizToJaiz />}
        {activeTab === "jaiz-to-other-banks" && <JaizToOthers />}
        {activeTab === "omni-payments" && <OmniPayments />}
        {activeTab === "mobile-payments" && <MobilePayments />}
        {activeTab === "electricity-transactions" && (
          <ElectricityTransactions />
        )}
        {activeTab === "nqr-transactions" && <NQRTransactions />}
        {activeTab === "airtime-data" && <AirtimeDataTransactions />}
      </div>
    </>
  );
};

export default Page;

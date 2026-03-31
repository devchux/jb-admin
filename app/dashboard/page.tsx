"use client";
import React, { useEffect, useState } from "react";
import { Users, ArrowUpRight, FileText, TrendingDown } from "lucide-react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { FunnelIcon } from "@heroicons/react/24/outline";
import DashboardCharts from "@/components/DasboardCharts";
import { DashboardSummaryResponse } from "@/types/response";
import { downloadCsvFromString, formatNumber } from "@/lib/utils";
import { dashboardService } from "@/services/dashboard";
import { exportService } from "@/services/export";
import { toast } from "sonner";

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState("ALL_TIME");
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);

  const metrics = [
    {
      id: 1,
      title: "Internal Users",
      value: formatNumber(summary?.totalUsers || 0),
      growth: 6.2,
      isPositive: true,
      icon: Users,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 2,
      title: "Total Transactions",
      value: formatNumber(summary?.totalTransactions || 0),
      growth: 5.4,
      isPositive: true,
      icon: FileText,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: 3,
      title: "Transaction Inflows",
      value: formatNumber(summary?.totalInflows || 0),
      growth: 5.4,
      isPositive: true,
      icon: ArrowUpRight,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 4,
      title: "Transaction Outflows",
      value: formatNumber(summary?.totalOutflows || 0),
      growth: 3.2,
      isPositive: false,
      icon: TrendingDown,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const getSummary = async () => {
    try {
      const { data } = await dashboardService.getSummary(dateFilter);
      setSummary(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportService.dashboard(dateFilter);
      downloadCsvFromString(response.data, "dashboard-metrics");
    } catch {
      toast.error("Failed to export dashboard metrics");
    }
  };

  useEffect(() => {
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  return (
    <div className="px-6">
      {/* Greatings */}
      <div className="font-medium text-2xl">
        <span className="text-[#6E6D6D]">Welcome, </span>Admin
      </div>

      {/* Header Section */}
      <div className="flex w-full justify-end items-center my-[40px]">
        {/* <div className="flex items-center flex-2/4 h-5 bg-white p-4  pr-4 py-6 mr-8 border border-gray-200 rounded-full ">
          <MagnifyingGlassIcon className="w-6 h-6 text-[#dddddd]" />
          <div className=" h-[38px] pl-4 border-[#dddddd] border-r-1"></div>
          <input
            type="text"
            placeholder="Search"
            className=" flex flex-1 pl-6 text-sm focus:outline-none focus:border-transparent"
          />
        </div> */}

        <div className="flex-2/4" />

        <div className="flex w-full items-center flex-1/4 h-5 bg-white p-4  pr-4 py-6 mr-8 border border-gray-200 rounded-full">
          <div className="flex flex-1 items-center space-x-2">
            <span className="text-xs text-[#dddddd] flex flex-row items-center">
              Date Filter by
              <FunnelIcon className="w-4 h-4 ml-1 text-[#dddddd]" />{" "}
            </span>
            <div className=" h-[38px] pl-2 border-[#dddddd] border-r-1"></div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="flex flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-transparent"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="ALL_TIME">All Time</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleExport}
          className=" bg-[#193F7F]  flex-1/6   text-white px-4 py-3 text-sm rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Export Dashboard Reports</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="flex flex-row items-center justify-between gap-6 rounded-2xl bg-white">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;

          return (
            <div
              key={metric.id}
              className="bg-white rounded-xl p-6 flex flex-1 flex-row items-center "
            >
              <div className="flex flex-1  items-start justify-between">
                <div className="flex-1 flex flex-row items-center justify-b">
                  <div
                    className={`w-[60px] h-[60px] ${metric.bgColor} rounded-full flex items-center justify-center `}
                  >
                    <IconComponent className={`w-5 h-5 ${metric.iconColor}`} />
                  </div>

                  <div className="ml-2">
                    <div className="flex flex-row items-center">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </h3>
                      {/* <div className="flex items-center space-x-1 ml-4">
                        {metric.isPositive ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            metric.isPositive
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {metric.growth}%
                        </span>
                      </div> */}
                    </div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                  </div>
                </div>
              </div>
              {metric.id !== 4 && (
                <div className=" h-[38px] pl-2 border-[#dddddd] border-r-1"></div>
              )}
            </div>
          );
        })}
      </div>

      <DashboardCharts dateFilter={dateFilter} setDateFilter={setDateFilter} />
    </div>
  );
};

export default Dashboard;

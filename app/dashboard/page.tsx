"use client";
import React, { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  Download,
  FileText,
  Users,
  WalletCards,
} from "lucide-react";

// import DashboardCharts from "@/components/DasboardCharts";
import AppUserMetrics from "@/components/dashboard/AppUserMetrics";
import FailedTransactionsTable from "@/components/dashboard/FailedTransactionsTable";
import TransactionStatusDistribution from "@/components/dashboard/TransactionStatusDistribution";
import { DashboardSummaryResponse } from "@/types/response";
import {
  downloadCsvFromString,
  formatCurrencyCompact,
  formatNumber,
} from "@/lib/utils";
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
      icon: Users,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 2,
      title: "Active Users",
      value: formatNumber(summary?.activeUsers || 0),
      icon: Activity,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      id: 3,
      title: "Total Transactions",
      value: formatNumber(summary?.totalTransactions || 0),
      icon: FileText,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: 4,
      title: "Transaction Value",
      value: formatCurrencyCompact(summary?.totalTransactionAmount || 0),
      icon: WalletCards,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Welcome back</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">Admin</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center rounded-full border border-[#DDE4EC] bg-white px-4 py-2.5 shadow-sm">
            <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="min-w-[140px] bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="ALL_TIME">All Time</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center rounded-full bg-[#193F7F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;

          return (
            <div
              key={metric.id}
              className="rounded-xl border border-[#E7ECF2] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-slate-500">
                  {metric.title}
                </p>
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${metric.bgColor}`}
                >
                  <IconComponent className={`h-5 w-5 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="truncate text-2xl font-bold text-slate-950">
                  {metric.value}
                </h3>
                <p className="mt-2 text-xs font-medium uppercase text-slate-400">
                  {dateFilter.replaceAll("_", " ").toLowerCase()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <TransactionStatusDistribution />

      <AppUserMetrics />

      <FailedTransactionsTable />

      {/* <DashboardCharts dateFilter={dateFilter} setDateFilter={setDateFilter} /> */}
    </div>
  );
};

export default Dashboard;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Download,
  FileText,
  LucideIcon,
  RotateCcw,
  Timer,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import LoadingIndicator from "@/components/LoadingIndicator";
import { dashboardService } from "@/services/dashboard";
import { exportService } from "@/services/export";
import { TransactionMetricsResponse } from "@/types/response";
import { TransactionMetricsRequest } from "@/types/request";
import { downloadBlob, formatNumber } from "@/lib/utils";

const dateFilters = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
  "CUSTOM_RANGE",
];
const statuses = ["ALL_STATUS", "SUCCESS", "FAILED", "PENDING", "REVERSED"];

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

type TransactionMetricsProps = {
  service: string;
  title?: string;
};

type TransactionMetricCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
};

const TransactionMetricCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor,
}: TransactionMetricCardProps) => (
  <div className="bg-white border border-[#E5E7EB] rounded-xl min-h-[132px] px-7 py-6 flex items-center">
    <div
      className={`w-[58px] h-[58px] ${bgColor} rounded-full flex items-center justify-center shrink-0`}
    >
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div className="ml-5 min-w-0">
      <h3 className="text-2xl font-bold text-gray-900 leading-tight">
        {value}
      </h3>
      <p className="text-base text-gray-600 leading-5">{title}</p>
    </div>
  </div>
);

const TransactionMetrics = ({
  service,
  title = "Transaction Metrics",
}: TransactionMetricsProps) => {
  const [metrics, setMetrics] = useState<TransactionMetricsResponse | null>(
    null,
  );
  const [dateFilter, setDateFilter] = useState("TODAY");
  const [status, setStatus] = useState("ALL_STATUS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const params: TransactionMetricsRequest = useMemo(
    () => ({
      dateFilter,
      service,
      status,
      ...(dateFilter === "CUSTOM_RANGE" && startDate && { startDate }),
      ...(dateFilter === "CUSTOM_RANGE" && endDate && { endDate }),
    }),
    [dateFilter, endDate, service, startDate, status],
  );

  const cards = [
    {
      title: "Total Transactions",
      value: formatNumber(metrics?.totalTransactions || 0),
      icon: FileText,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Transaction Value",
      value: formatNumber(metrics?.totalTransactionValue || 0),
      icon: TrendingUp,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Success Rate",
      value: `${metrics?.successRate || 0}%`,
      icon: TrendingUp,
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      title: "Failed Transactions",
      value: formatNumber(metrics?.failedTransactions || 0),
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Pending Transactions",
      value: formatNumber(metrics?.pendingTransactions || 0),
      icon: Timer,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Reversed Transactions",
      value: formatNumber(metrics?.reversedTransactions || 0),
      icon: RotateCcw,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const chartData = [
    {
      name: "Successful",
      value: Math.max(
        (metrics?.totalTransactions || 0) -
          (metrics?.failedTransactions || 0) -
          (metrics?.pendingTransactions || 0) -
          (metrics?.reversedTransactions || 0),
        0,
      ),
      color: "#16A34A",
    },
    {
      name: "Failed",
      value: metrics?.failedTransactions || 0,
      color: "#DC2626",
    },
    {
      name: "Pending",
      value: metrics?.pendingTransactions || 0,
      color: "#F59E0B",
    },
    {
      name: "Reversed",
      value: metrics?.reversedTransactions || 0,
      color: "#7C3AED",
    },
  ];

  const getMetrics = async () => {
    if (dateFilter === "CUSTOM_RANGE" && (!startDate || !endDate)) return;

    try {
      setLoading(true);
      const { data } = await dashboardService.getTransactionMetrics(params);
      setMetrics(data);
    } catch {
      toast.error("Failed to fetch transaction metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportService.transactionDashboardMetrics(params);
      downloadBlob(response.data, "transaction_dashboard_metrics.csv");
    } catch {
      toast.error("Failed to export transaction metrics");
    }
  };

  useEffect(() => {
    getMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="mb-6 relative bg-[#F4F5F7] rounded-lg p-6">
      {loading && <LoadingIndicator />}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-7">
        <div className="flex items-center">
          <div className="w-2.5 h-9 bg-[#193F7F] rounded-full mr-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white border border-[#E5E7EB] rounded-full px-6 py-3 text-sm outline-none min-w-[180px] shadow-sm"
          >
            {dateFilters.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>
          {dateFilter === "CUSTOM_RANGE" && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none shadow-sm"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none shadow-sm"
              />
            </>
          )}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white border border-[#E5E7EB] rounded-full px-6 py-3 text-sm outline-none min-w-[160px] shadow-sm"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="bg-[#193F7F] text-white px-6 py-3 text-sm rounded-full transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Metrics</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {cards.map((card) => (
            <TransactionMetricCard key={card.title} {...card} />
          ))}
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-7 min-h-[286px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">
            Status Breakdown
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionMetrics;

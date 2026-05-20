"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  Download,
  ListTree,
  RotateCcw,
  Timer,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import LoadingIndicator from "@/components/LoadingIndicator";
import MetricCard from "@/components/dashboard/MetricCard";
import { dashboardService } from "@/services/dashboard";
import { exportService } from "@/services/export";
import { BillPaymentMetricsRequest } from "@/types/request";
import {
  BillPaymentSummaryResponse,
  OperationsSummaryItem,
} from "@/types/response";
import {
  downloadBlob,
  formatCurrencyCompact,
  formatNumber,
} from "@/lib/utils";

const dateFilters = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
  "CUSTOM_RANGE",
];

const categories = [
  "ALL_CATEGORIES",
  "ELECTRICITY",
  "AIRTIME_DATA",
  "CABLE_TV",
];

const statuses = ["ALL_STATUS", "SUCCESS", "FAILED", "PENDING", "REVERSED"];

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

const emptySummary: BillPaymentSummaryResponse = {
  totalBillPayments: 0,
  totalValue: 0,
  successful: 0,
  failed: 0,
  pending: 0,
  reversed: 0,
  successRate: 0,
};

const BillPaymentDashboard = () => {
  const [summary, setSummary] =
    useState<BillPaymentSummaryResponse>(emptySummary);
  const [breakdown, setBreakdown] = useState<OperationsSummaryItem[]>([]);
  const [dateFilter, setDateFilter] = useState("TODAY");
  const [category, setCategory] = useState("ALL_CATEGORIES");
  const [status, setStatus] = useState("ALL_STATUS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const params: BillPaymentMetricsRequest = useMemo(
    () => ({
      dateFilter,
      category,
      status,
      ...(dateFilter === "CUSTOM_RANGE" && startDate && { startDate }),
      ...(dateFilter === "CUSTOM_RANGE" && endDate && { endDate }),
    }),
    [category, dateFilter, endDate, startDate, status],
  );

  const cards = [
    {
      title: "Bill Payments",
      value: formatNumber(summary.totalBillPayments),
      icon: ListTree,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Value",
      value: formatCurrencyCompact(summary.totalValue),
      icon: Banknote,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Success Rate",
      value: `${summary.successRate || 0}%`,
      icon: TrendingUp,
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      title: "Failed",
      value: formatNumber(summary.failed),
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Pending",
      value: formatNumber(summary.pending),
      icon: Timer,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Reversed",
      value: formatNumber(summary.reversed),
      icon: RotateCcw,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const getBillPayments = async () => {
    if (dateFilter === "CUSTOM_RANGE" && (!startDate || !endDate)) return;

    try {
      setLoading(true);
      const [summaryResponse, breakdownResponse] = await Promise.all([
        dashboardService.getBillPaymentSummary(params),
        dashboardService.getBillPaymentServiceBreakdown(params),
      ]);
      setSummary(summaryResponse.data || emptySummary);
      setBreakdown(breakdownResponse.data.items || []);
    } catch {
      toast.error("Failed to fetch bill payment dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportService.billPayments(params);
      downloadBlob(response.data, "bill_payments.csv");
    } catch {
      toast.error("Failed to export bill payments");
    }
  };

  useEffect(() => {
    getBillPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <section className="relative bg-[#F4F5F7] rounded-lg p-6 mb-6">
      {loading && <LoadingIndicator />}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-7">
        <div className="flex items-center">
          <div className="w-2.5 h-9 bg-[#193F7F] rounded-full mr-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Bill Payment Dashboard
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none min-w-[165px]"
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
                onChange={(event) => setStartDate(event.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none"
              />
            </>
          )}
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none min-w-[170px]"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none min-w-[150px]"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="bg-[#193F7F] text-white px-5 py-3 text-sm rounded-full transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <MetricCard key={card.title} {...card} />
        ))}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Service Breakdown
          </h3>
          <span className="text-sm text-slate-500">
            {formatNumber(summary.successful)} successful
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {breakdown.map((item) => (
            <div
              key={item.service}
              className="border border-[#EEF1F4] rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h4 className="font-semibold text-gray-900">{item.label}</h4>
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  {formatNumber(item.totalTransactions)} txns
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrencyCompact(item.totalValue)}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="font-bold text-emerald-600">
                    {formatNumber(item.successful)}
                  </p>
                  <p className="text-xs text-slate-500">Success</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">
                    {formatNumber(item.failed)}
                  </p>
                  <p className="text-xs text-slate-500">Failed</p>
                </div>
                <div>
                  <p className="font-bold text-orange-500">
                    {formatNumber(item.pending)}
                  </p>
                  <p className="text-xs text-slate-500">Pending</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && breakdown.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500">
            No bill-payment breakdown available.
          </div>
        )}
      </div>
    </section>
  );
};

export default BillPaymentDashboard;

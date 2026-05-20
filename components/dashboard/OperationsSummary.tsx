"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Lightbulb,
  LucideIcon,
  Phone,
  RadioTower,
  Tv,
  Wifi,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import LoadingIndicator from "@/components/LoadingIndicator";
import { dashboardService } from "@/services/dashboard";
import { OperationsSummaryItem } from "@/types/response";
import { OperationsSummaryRequest } from "@/types/request";
import { formatCurrencyCompact, formatNumber } from "@/lib/utils";

const dateFilters = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
  "CUSTOM_RANGE",
];

const statuses = ["ALL_STATUS", "SUCCESS", "FAILED", "PENDING", "REVERSED"];

const serviceIcons: Record<string, LucideIcon> = {
  JAIZ_TO_JAIZ: Zap,
  INTERBANK: Wifi,
  ELECTRICITY: Lightbulb,
  AIRTIME_DATA: Phone,
  CABLE_TV: Tv,
  OTHER_BILL_PAYMENT: RadioTower,
};

const serviceColors: Record<string, string> = {
  JAIZ_TO_JAIZ: "text-emerald-600 bg-emerald-50",
  INTERBANK: "text-teal-600 bg-teal-50",
  ELECTRICITY: "text-amber-500 bg-amber-50",
  AIRTIME_DATA: "text-blue-500 bg-blue-50",
  CABLE_TV: "text-cyan-500 bg-cyan-50",
  OTHER_BILL_PAYMENT: "text-slate-500 bg-slate-100",
};

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

type OperationsSummaryProps = {
  variant: "transfers" | "bill-payments";
  title?: string;
  compact?: boolean;
};

type SummaryCardProps = {
  item: OperationsSummaryItem;
};

const SummaryCard = ({ item }: SummaryCardProps) => {
  const Icon = serviceIcons[item.service] || Building2;
  const iconColor = serviceColors[item.service] || "text-[#193F7F] bg-blue-50";

  return (
    <div className="bg-white border border-[#E1E5EA] rounded-xl px-7 py-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-7">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`h-9 w-9 rounded-full flex items-center justify-center ${iconColor}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 truncate">
            {item.label}
          </h3>
        </div>
        <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
          {formatNumber(item.totalTransactions)} txns
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrencyCompact(item.totalValue)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Value</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-600">
            {formatNumber(item.successful)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Success</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-600">
            {formatNumber(item.failed)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Failed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-orange-500">
            {formatNumber(item.pending)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Pending</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-violet-600">
            {formatNumber(item.reversed || 0)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Reversed</p>
        </div>
      </div>
    </div>
  );
};

const OperationsSummary = ({
  variant,
  title,
  compact = false,
}: OperationsSummaryProps) => {
  const [items, setItems] = useState<OperationsSummaryItem[]>([]);
  const [dateFilter, setDateFilter] = useState("TODAY");
  const [status, setStatus] = useState("ALL_STATUS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const params: OperationsSummaryRequest = useMemo(
    () => ({
      dateFilter,
      status,
      ...(dateFilter === "CUSTOM_RANGE" && startDate && { startDate }),
      ...(dateFilter === "CUSTOM_RANGE" && endDate && { endDate }),
    }),
    [dateFilter, endDate, startDate, status],
  );

  const getSummary = async () => {
    if (dateFilter === "CUSTOM_RANGE" && (!startDate || !endDate)) return;

    try {
      setLoading(true);
      const { data } =
        variant === "transfers"
          ? await dashboardService.getTransferOperationsSummary(params)
          : await dashboardService.getBillPaymentOperationsSummary(params);
      setItems(data.items || []);
    } catch {
      toast.error(`Failed to fetch ${formatLabel(variant)} summary`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, variant]);

  return (
    <section className="relative">
      {loading && <LoadingIndicator />}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-5">
        <div className="flex items-center min-w-0">
          <div className="w-2.5 h-8 bg-[#193F7F] rounded-full mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {title ||
              (variant === "transfers"
                ? "Transfer Operations Summary"
                : "Bill Payment Operations Summary")}
          </h2>
          <div className="hidden md:block h-px bg-[#D6DAE0] flex-1 ml-5" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none min-w-[160px]"
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
        </div>
      </div>

      <div
        className={
          compact
            ? "grid grid-cols-1 gap-4"
            : "grid grid-cols-1 xl:grid-cols-2 gap-6"
        }
      >
        {items.map((item) => (
          <SummaryCard key={item.service} item={item} />
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl py-12 text-center text-sm text-slate-500">
          No operation summary data available.
        </div>
      )}
    </section>
  );
};

export default OperationsSummary;

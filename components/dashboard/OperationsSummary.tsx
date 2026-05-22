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

const statusStats = [
  {
    key: "successful",
    label: "Success",
    color: "text-emerald-700",
    bg: "bg-emerald-500",
  },
  {
    key: "failed",
    label: "Failed",
    color: "text-red-700",
    bg: "bg-red-500",
  },
  {
    key: "pending",
    label: "Pending",
    color: "text-orange-600",
    bg: "bg-orange-500",
  },
  {
    key: "reversed",
    label: "Reversed",
    color: "text-violet-700",
    bg: "bg-violet-500",
  },
] as const;

const SummaryCard = ({ item }: SummaryCardProps) => {
  const Icon = serviceIcons[item.service] || Building2;
  const iconColor = serviceColors[item.service] || "text-[#193F7F] bg-blue-50";
  const totalTransactions = item.totalTransactions || 0;
  const successRate =
    item.successRate ??
    (totalTransactions ? (item.successful / totalTransactions) * 100 : 0);

  return (
    <div className="group overflow-hidden rounded-xl border border-[#DDE4EC] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconColor}`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-slate-950">
                {item.label}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {formatNumber(totalTransactions)} transactions processed
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-slate-950">
              {formatCurrencyCompact(item.totalValue)}
            </p>
            <p className="mt-1 text-xs font-medium uppercase text-slate-500">
              Total value
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-lg border border-[#E7ECF2] bg-[#F8FAFC] px-4 py-3">
            <p className="text-xs font-medium text-slate-500">Success rate</p>
            <p className="mt-1 text-xl font-bold text-[#193F7F]">
              {Math.round(successRate)}%
            </p>
          </div>

          {statusStats.map((stat) => {
            const value = Number(item[stat.key] || 0);

            return (
              <div
                key={stat.key}
                className="rounded-lg border border-[#E7ECF2] px-4 py-3"
              >
                <p className="text-xs font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className={`mt-1 text-xl font-bold ${stat.color}`}>
                  {formatNumber(value)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
          {statusStats.map((stat) => {
            const value = Number(item[stat.key] || 0);
            const width = totalTransactions
              ? Math.max((value / totalTransactions) * 100, value ? 6 : 0)
              : 0;

            return (
              <div
                key={stat.key}
                className={`${stat.bg} transition-all`}
                style={{ width: `${width}%` }}
              />
            );
          })}
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
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center min-w-0">
          <div className="mr-3 h-8 w-2 rounded-full bg-[#193F7F]" />
          <h2 className="truncate text-xl font-semibold text-slate-950">
            {title ||
              (variant === "transfers"
                ? "Transfer Operations Summary"
                : "Bill Payment Operations Summary")}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="min-w-[160px] rounded-full border border-[#DDE4EC] bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none"
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
                className="rounded-full border border-[#DDE4EC] bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-full border border-[#DDE4EC] bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none"
              />
            </>
          )}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="min-w-[150px] rounded-full border border-[#DDE4EC] bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none"
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
            : "grid grid-cols-1 gap-5 xl:grid-cols-2"
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

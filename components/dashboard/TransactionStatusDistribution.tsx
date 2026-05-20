"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import LoadingIndicator from "@/components/LoadingIndicator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dashboardService } from "@/services/dashboard";
import { TransactionStatusDistributionItem } from "@/types/response";
import { TransactionStatusDistributionRequest } from "@/types/request";
import { formatNumber } from "@/lib/utils";

const dateFilters = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
  "CUSTOM_RANGE",
];

const services = [
  "ALL_SERVICES",
  "TRANSFERS",
  "JAIZ_TO_JAIZ",
  "INTERBANK",
  "ELECTRICITY",
  "AIRTIME_DATA",
  "CABLE_TV",
];

const statusColors: Record<string, string> = {
  SUCCESSFUL: "#158A55",
  FAILED: "#F05252",
  PENDING: "#D5B24C",
  REVERSED: "#4F83D8",
  REVERSAL_PENDING: "#7C3AED",
  UNKNOWN: "#94A3B8",
};

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

const TransactionStatusDistribution = () => {
  const [statuses, setStatuses] = useState<TransactionStatusDistributionItem[]>(
    [],
  );
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [dateFilter, setDateFilter] = useState("TODAY");
  const [service, setService] = useState("ALL_SERVICES");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const params: TransactionStatusDistributionRequest = useMemo(
    () => ({
      dateFilter,
      service,
      ...(dateFilter === "CUSTOM_RANGE" && startDate && { startDate }),
      ...(dateFilter === "CUSTOM_RANGE" && endDate && { endDate }),
    }),
    [dateFilter, endDate, service, startDate],
  );

  const getDistribution = async () => {
    if (dateFilter === "CUSTOM_RANGE" && (!startDate || !endDate)) return;

    try {
      setLoading(true);
      const { data } =
        await dashboardService.getTransactionStatusDistribution(params);
      setTotalTransactions(data.totalTransactions || 0);
      setStatuses(data.statuses || []);
    } catch {
      toast.error("Failed to fetch transaction status distribution");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDistribution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <section className="relative bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6 my-8">
      {loading && <LoadingIndicator />}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-6">
        <div className="flex items-center">
          <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Transaction Status Distribution
            </h2>
            <p className="text-sm text-slate-500">
              {formatNumber(totalTransactions)} matching transactions
            </p>
          </div>
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
            value={service}
            onChange={(event) => setService(event.target.value)}
            className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none min-w-[170px]"
          >
            {services.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
        {statuses.map((item) => {
          const height = Math.max(item.percentage * 1.6, item.count > 0 ? 8 : 4);
          const color = statusColors[item.status] || statusColors.UNKNOWN;

          return (
            <Tooltip key={item.status}>
              <TooltipTrigger asChild>
                <div className="cursor-default">
                  <div className="h-[152px] flex items-end">
                    <div
                      className="w-full rounded-[3px]"
                      style={{ height: `${height}px`, backgroundColor: color }}
                    />
                  </div>
                  <div className="mt-3">
                    <p className="text-base font-semibold text-gray-900">
                      {item.percentage.toFixed(1)}%
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-3.5 h-3.5 rounded-[3px] shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-gray-600">
                        {formatLabel(item.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {formatNumber(item.count)} {formatLabel(item.status)}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {!loading && statuses.length === 0 && (
        <div className="py-10 text-center text-sm text-slate-500">
          No status distribution available.
        </div>
      )}
    </section>
  );
};

export default TransactionStatusDistribution;

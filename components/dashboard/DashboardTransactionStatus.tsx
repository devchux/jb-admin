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
import { TransactionMetricsResponse } from "@/types/response";

const dateFilters = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
];

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

const DashboardTransactionStatus = () => {
  const [metrics, setMetrics] = useState<TransactionMetricsResponse | null>(
    null,
  );
  const [dateFilter, setDateFilter] = useState("TODAY");
  const [loading, setLoading] = useState(false);

  const statusData = useMemo(() => {
    const total = metrics?.totalTransactions || 0;
    const failed = metrics?.failedTransactions || 0;
    const pending = metrics?.pendingTransactions || 0;
    const reversed = metrics?.reversedTransactions || 0;
    const successful = Math.max(
      Math.round(total * ((metrics?.successRate || 0) / 100)),
      0,
    );
    const unknown = Math.max(total - successful - failed - pending - reversed, 0);

    const items = [
      { label: "Successful", value: successful, color: "#158A55" },
      { label: "Failed", value: failed, color: "#F05252" },
      { label: "Pending", value: pending, color: "#D5B24C" },
      { label: "Reversed", value: reversed, color: "#4F83D8" },
      { label: "Unknown", value: unknown, color: "#94A3B8" },
    ];

    return items.map((item) => ({
      ...item,
      percent: total ? (item.value / total) * 100 : 0,
    }));
  }, [metrics]);

  const getMetrics = async () => {
    try {
      setLoading(true);
      const { data } = await dashboardService.getTransactionMetrics({
        dateFilter,
        service: "ALL_SERVICES",
        status: "ALL_STATUS",
      });
      setMetrics(data);
    } catch {
      toast.error("Failed to fetch transaction status metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  return (
    <div className="relative bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6 my-8">
      {loading && <LoadingIndicator />}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Transaction Status
          </h2>
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-white border border-[#E5E7EB] rounded-full px-5 py-3 text-sm outline-none min-w-[170px]"
        >
          {dateFilters.map((item) => (
            <option key={item} value={item}>
              {formatLabel(item)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
        {statusData.map((item) => {
          const height = Math.max(item.percent * 1.6, item.value > 0 ? 8 : 4);

          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <div className="cursor-default">
                  <div className="h-[152px] flex items-end">
                    <div
                      className="w-full rounded-[3px]"
                      style={{
                        height: `${height}px`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>

                  <div className="mt-3">
                    <p className="text-base font-semibold text-gray-900">
                      {item.percent.toFixed(1)}%
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-3.5 h-3.5 rounded-[3px] shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <p className="text-base text-[#73839A]">{item.label}</p>
                    </div>
                    <p className="text-sm text-[#73839A] ml-5">
                      {item.value.toLocaleString()} txns
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#3F3F3F] text-white text-sm font-semibold">
                {item.label}: {item.value.toLocaleString()} (
                {item.percent.toFixed(1)}%)
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardTransactionStatus;

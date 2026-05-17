"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Clock, FilePenLine, Megaphone, Send, XCircle } from "lucide-react";
import { toast } from "sonner";
import LoadingIndicator from "@/components/LoadingIndicator";
import MetricCard from "@/components/dashboard/MetricCard";
import { notificationService } from "@/services/notification";
import { BroadcastMetricsResponse } from "@/types/response";
import { formatNumber } from "@/lib/utils";

const BroadcastMetrics = () => {
  const [metrics, setMetrics] = useState<BroadcastMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const cards = [
    {
      title: "Total Broadcasts",
      value: formatNumber(metrics?.totalBroadcasts || 0),
      icon: Megaphone,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Scheduled",
      value: formatNumber(metrics?.scheduled || 0),
      icon: Clock,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Sent",
      value: formatNumber(metrics?.sent || 0),
      icon: Send,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Draft",
      value: formatNumber(metrics?.draft || 0),
      icon: FilePenLine,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      title: "Failed",
      value: formatNumber(metrics?.failed || 0),
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const chartData = useMemo(
    () => [
      { name: "Scheduled", value: metrics?.scheduled || 0, color: "#F97316" },
      { name: "Sent", value: metrics?.sent || 0, color: "#16A34A" },
      { name: "Draft", value: metrics?.draft || 0, color: "#6B7280" },
      { name: "Failed", value: metrics?.failed || 0, color: "#DC2626" },
    ],
    [metrics],
  );

  const getMetrics = async () => {
    try {
      setLoading(true);
      const { data } = await notificationService.getBroadcastMetrics();
      setMetrics(data);
    } catch {
      toast.error("Failed to fetch broadcast metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMetrics();
  }, []);

  return (
    <div className="mb-6 relative">
      {loading && <LoadingIndicator />}
      <div className="flex items-center mb-5">
        <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
        <h2 className="text-xl font-semibold text-gray-900">
          Broadcast Metrics
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>
        <div className="bg-white border border-[#EEEEEE] rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Broadcast Status
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={82}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => Number(value || 0).toLocaleString()}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastMetrics;

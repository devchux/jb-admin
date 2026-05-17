"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Download,
  KeyRound,
  Lock,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import LoadingIndicator from "@/components/LoadingIndicator";
import MetricCard from "@/components/dashboard/MetricCard";
import { userService } from "@/services/user";
import { exportService } from "@/services/export";
import { AdminAccessMetricsResponse } from "@/types/response";
import { downloadBlob, formatNumber } from "@/lib/utils";

const AdminAccessMetrics = () => {
  const [metrics, setMetrics] = useState<AdminAccessMetricsResponse | null>(
    null,
  );
  const [noRecentLoginCutoff, setNoRecentLoginCutoff] = useState("2024-01-01");
  const [loading, setLoading] = useState(false);

  const cards = [
    {
      title: "Total Admin Users",
      value: formatNumber(metrics?.totalAdminUsers || 0),
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Admin Users",
      value: formatNumber(metrics?.activeAdminUsers || 0),
      icon: UserCheck,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Active Percentage",
      value: `${metrics?.activePercentage || 0}%`,
      icon: ShieldCheck,
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      title: "Inactive Admin Users",
      value: formatNumber(metrics?.inactiveAdminUsers || 0),
      icon: UserMinus,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      title: "Locked Accounts",
      value: formatNumber(metrics?.lockedAccounts || 0),
      icon: Lock,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Pending First Login",
      value: formatNumber(metrics?.pendingFirstLogin || 0),
      icon: KeyRound,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Password Reset Required",
      value: formatNumber(metrics?.passwordResetRequired || 0),
      icon: KeyRound,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "No Recent Login",
      value: formatNumber(metrics?.noRecentLogin || 0),
      icon: UserMinus,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const chartData = useMemo(
    () => [
      {
        name: "Active",
        value: metrics?.activeAdminUsers || 0,
        color: "#16A34A",
      },
      {
        name: "Inactive",
        value: metrics?.inactiveAdminUsers || 0,
        color: "#6B7280",
      },
      {
        name: "Locked",
        value: metrics?.lockedAccounts || 0,
        color: "#DC2626",
      },
      {
        name: "No Recent Login",
        value: metrics?.noRecentLogin || 0,
        color: "#7C3AED",
      },
    ],
    [metrics],
  );

  const getMetrics = async () => {
    try {
      setLoading(true);
      const { data } =
        await userService.getAdminAccessMetrics(noRecentLoginCutoff);
      setMetrics(data);
    } catch {
      toast.error("Failed to fetch admin access metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportService.adminAccessMetrics({
        noRecentLoginCutoff,
      });
      downloadBlob(response.data, "admin_access_metrics.csv");
    } catch {
      toast.error("Failed to export admin access metrics");
    }
  };

  useEffect(() => {
    getMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noRecentLoginCutoff]);

  return (
    <div className="mb-8 relative">
      {loading && <LoadingIndicator />}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Admin Access Control
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={noRecentLoginCutoff}
            onChange={(e) => setNoRecentLoginCutoff(e.target.value)}
            className="bg-white border border-[#EEEEEE] rounded-full px-4 py-3 text-sm outline-none"
          />
          <button
            onClick={handleExport}
            className="bg-[#193F7F] text-white px-4 py-3 text-sm rounded-full transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Metrics</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>
        <div className="bg-white border border-[#EEEEEE] rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Access Status
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={82}
                  paddingAngle={3}
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

export default AdminAccessMetrics;

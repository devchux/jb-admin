"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Lock,
  LogIn,
  ShieldAlert,
  UserCheck,
  UserPlus,
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
import { dashboardService } from "@/services/dashboard";
import { AppUserMetricsResponse } from "@/types/response";
import { formatNumber } from "@/lib/utils";

const AppUserMetrics = () => {
  const [metrics, setMetrics] = useState<AppUserMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const cards = [
    {
      title: "Registered Users",
      value: formatNumber(metrics?.totalRegisteredUsers || 0),
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "New Enrollments Today",
      value: formatNumber(metrics?.newEnrollmentsToday || 0),
      icon: UserPlus,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Active Users Today",
      value: formatNumber(metrics?.activeUsersToday || 0),
      icon: UserCheck,
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      title: "Failed Enrollments",
      value: formatNumber(metrics?.failedEnrollmentAttempts || 0),
      icon: ShieldAlert,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Failed Login Attempts",
      value: formatNumber(metrics?.failedLoginAttempts || 0),
      icon: LogIn,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Locked Profiles",
      value: formatNumber(metrics?.lockedProfiles || 0),
      icon: Lock,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  const chartData = useMemo(
    () => [
      {
        name: "Active Today",
        value: metrics?.activeUsersToday || 0,
        color: "#0D9488",
      },
      {
        name: "Failed Enrollments",
        value: metrics?.failedEnrollmentAttempts || 0,
        color: "#F97316",
      },
      {
        name: "Failed Logins",
        value: metrics?.failedLoginAttempts || 0,
        color: "#EF4444",
      },
      {
        name: "Locked Profiles",
        value: metrics?.lockedProfiles || 0,
        color: "#6B7280",
      },
    ],
    [metrics],
  );

  const getMetrics = async () => {
    try {
      setLoading(true);
      const { data } = await dashboardService.getAppUserMetrics();
      setMetrics(data);
    } catch {
      toast.error("Failed to fetch app-user metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMetrics();
  }, []);

  return (
    <div className="my-8 relative">
      {loading && <LoadingIndicator />}
      <div className="flex items-center mb-5">
        <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
        <h2 className="text-xl font-semibold text-gray-900">
          App-User Metrics
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
            User Activity Mix
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

export default AppUserMetrics;

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
import AccountActivityCounts from "@/components/dashboard/AccountActivityCounts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger
              aria-label="Dashboard date range"
              className="h-11 min-w-44 rounded-full bg-background px-4 shadow-sm"
            >
              <CalendarDays data-icon="inline-start" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
                <SelectItem value="ALL_TIME">All time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={handleExport}
            className="h-11 rounded-full bg-[#193F7F] px-5 text-white hover:bg-[#132F60]"
          >
            <Download data-icon="inline-start" />
            Export report
          </Button>
        </div>
      </div>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;

          return (
            <Card
              key={metric.id}
              className="gap-5 border-[#E7ECF2] py-5 transition-shadow hover:shadow-md"
            >
              <CardHeader className="px-5">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <CardAction
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full",
                    metric.bgColor,
                  )}
                >
                  <IconComponent
                    aria-hidden="true"
                    className={cn("size-5", metric.iconColor)}
                  />
                </CardAction>
              </CardHeader>
              <CardContent className="px-5">
                <p className="truncate text-2xl font-bold text-foreground">
                  {metric.value}
                </p>
                <CardDescription className="mt-2 text-xs font-medium uppercase">
                  {dateFilter.replaceAll("_", " ").toLowerCase()}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TransactionStatusDistribution />

      <AccountActivityCounts />

      <AppUserMetrics />

      <FailedTransactionsTable />

      {/* <DashboardCharts dateFilter={dateFilter} setDateFilter={setDateFilter} /> */}
    </div>
  );
};

export default Dashboard;

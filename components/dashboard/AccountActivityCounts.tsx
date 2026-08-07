"use client";

import { useEffect, useState } from "react";
import { MonitorSmartphone, UserPlus, UserRoundCheck, WalletCards } from "lucide-react";
import { toast } from "sonner";
import MetricCard from "./MetricCard";
import { dashboardService } from "@/services/dashboard";
import { AccountActivityDateRequest } from "@/types/request";
import { formatNumber } from "@/lib/utils";

type Counts = { registrations: number; pendingLogin: number; devices: number; accounts: number };

const filters = [
  ["TODAY", "Today"], ["YESTERDAY", "Yesterday"], ["LAST_7_DAYS", "Last 7 days"],
  ["LAST_30_DAYS", "Last 30 days"], ["THIS_MONTH", "This month"], ["CUSTOM_RANGE", "Custom range"],
] as const;

export default function AccountActivityCounts() {
  const [dateFilter, setDateFilter] = useState<AccountActivityDateRequest["dateFilter"]>("TODAY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [counts, setCounts] = useState<Counts>({ registrations: 0, pendingLogin: 0, devices: 0, accounts: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dateFilter === "CUSTOM_RANGE" && (!startDate || !endDate)) return;
    const params: AccountActivityDateRequest = { dateFilter };
    if (dateFilter === "CUSTOM_RANGE") Object.assign(params, { startDate, endDate });
    setLoading(true);
    Promise.all([
      dashboardService.getNewRegistrationCount(params),
      dashboardService.getPendingFirstLoginCount(params),
      dashboardService.getNewDeviceRegistrationCount(params),
      dashboardService.getNewAccountCreationCount(params),
    ]).then(([registrations, pendingLogin, devices, accounts]) => {
      setCounts({ registrations: registrations.data, pendingLogin: pendingLogin.data, devices: devices.data, accounts: accounts.data });
    }).catch(() => toast.error("Failed to fetch account activity counts"))
      .finally(() => setLoading(false));
  }, [dateFilter, startDate, endDate]);

  const cards = [
    { title: "New registrations", value: formatNumber(counts.registrations), icon: UserPlus, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { title: "Pending first login", value: formatNumber(counts.pendingLogin), icon: UserRoundCheck, bgColor: "bg-amber-100", iconColor: "text-amber-700" },
    { title: "New device registrations", value: formatNumber(counts.devices), icon: MonitorSmartphone, bgColor: "bg-teal-100", iconColor: "text-teal-700" },
    { title: "New account creations", value: formatNumber(counts.accounts), icon: WalletCards, bgColor: "bg-indigo-100", iconColor: "text-indigo-700" },
  ];

  return <section className="my-8" aria-busy={loading}>
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center"><div className="mr-3 h-8 w-3 rounded-full bg-[#193F7F]" /><h2 className="text-xl font-semibold text-gray-900">Account Activity</h2></div>
      <div className="flex flex-wrap gap-2">
        <select aria-label="Account activity date range" value={dateFilter} onChange={(event) => setDateFilter(event.target.value as AccountActivityDateRequest["dateFilter"])} className="rounded-lg border border-[#DDE4EC] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#193F7F]">
          {filters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        {dateFilter === "CUSTOM_RANGE" && <><input aria-label="Start date" type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} className="rounded-lg border border-[#DDE4EC] bg-white px-3 py-2 text-sm" /><input aria-label="End date" type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} className="rounded-lg border border-[#DDE4EC] bg-white px-3 py-2 text-sm" /></>}
      </div>
    </div>
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${loading ? "animate-pulse opacity-60" : ""}`}>{cards.map((card) => <MetricCard key={card.title} {...card} />)}</div>
  </section>;
}

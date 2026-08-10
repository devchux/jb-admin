"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dashboardService } from "@/services/dashboard";
import {
  AccountActivityDateRequest,
  AccountActivityListRequest,
} from "@/types/request";
import {
  AccountCreation,
  DeviceRegistration,
  RegisteredAppUser,
} from "@/types/common";

type ActivityKind = "registrations" | "pending-login" | "devices" | "accounts";
type ActivityRecord = RegisteredAppUser | DeviceRegistration | AccountCreation;
type Column = { key: string; label: string; format?: "date" | "status" };

const filters = [
  ["TODAY", "Today"],
  ["YESTERDAY", "Yesterday"],
  ["LAST_7_DAYS", "Last 7 days"],
  ["LAST_30_DAYS", "Last 30 days"],
  ["THIS_MONTH", "This month"],
  ["CUSTOM_RANGE", "Custom range"],
] as const;

const config: Record<
  ActivityKind,
  { title: string; description: string; sortBy: string; columns: Column[] }
> = {
  registrations: {
    title: "New Registrations",
    description: "App-user profiles created in the selected period.",
    sortBy: "dateTimeCreated",
    columns: [
      { key: "firstName", label: "First name" },
      { key: "lastName", label: "Last name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone number" },
      { key: "registrationAccountNumber", label: "Account number" },
      { key: "registeredAt", label: "Registered", format: "date" },
    ],
  },
  "pending-login": {
    title: "Pending First Login",
    description: "Registered users without a successful first login.",
    sortBy: "dateTimeCreated",
    columns: [
      { key: "firstName", label: "First name" },
      { key: "lastName", label: "Last name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone number" },
      { key: "registrationAccountType", label: "Account type" },
      { key: "registeredAt", label: "Registered", format: "date" },
    ],
  },
  devices: {
    title: "Device Registrations",
    description: "Successful device registration and binding activity.",
    sortBy: "timestamp",
    columns: [
      { key: "email", label: "Email" },
      { key: "deviceName", label: "Device" },
      { key: "deviceType", label: "Type" },
      { key: "osVersion", label: "OS version" },
      { key: "accountNumber", label: "Account number" },
      { key: "status", label: "Status", format: "status" },
      { key: "registeredAt", label: "Registered", format: "date" },
    ],
  },
  accounts: {
    title: "Account Creations",
    description:
      "Successful customer account and account-profile creation activity.",
    sortBy: "timestamp",
    columns: [
      { key: "email", label: "Email" },
      { key: "accountNumber", label: "Account number" },
      { key: "accountType", label: "Type" },
      { key: "accountTier", label: "Tier" },
      { key: "branchCode", label: "Branch" },
      { key: "status", label: "Status", format: "status" },
      { key: "createdAt", label: "Created", format: "date" },
    ],
  },
};

function displayValue(value: unknown, format?: Column["format"]) {
  if (value === null || value === undefined || value === "") return "—";
  if (format === "date") {
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export default function AccountActivityTable({ kind }: { kind: ActivityKind }) {
  const currentConfig = config[kind];
  const [dateFilter, setDateFilter] =
    useState<AccountActivityDateRequest["dateFilter"]>("TODAY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<ActivityRecord[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ActivityRecord | null>(null);

  useEffect(() => setCurrentPage(1), [dateFilter, startDate, endDate]);

  useEffect(() => {
    if (dateFilter === "CUSTOM_RANGE" && (!startDate || !endDate)) return;
    const params: AccountActivityListRequest = {
      page: currentPage - 1,
      size: 20,
      sortBy: currentConfig.sortBy,
      sortDirection: "DESC",
      dateFilter,
    };
    if (dateFilter === "CUSTOM_RANGE")
      Object.assign(params, { startDate, endDate });
    const request =
      kind === "registrations"
        ? dashboardService.getNewRegistrations(params)
        : kind === "pending-login"
          ? dashboardService.getPendingFirstLogins(params)
          : kind === "devices"
            ? dashboardService.getNewDeviceRegistrations(params)
            : dashboardService.getNewAccountCreations(params);
    setLoading(true);
    request
      .then(({ data }) => {
        setRows(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(() =>
        toast.error(`Failed to fetch ${currentConfig.title.toLowerCase()}`),
      )
      .finally(() => setLoading(false));
  }, [currentConfig, currentPage, dateFilter, endDate, kind, startDate]);

  const details = useMemo(
    () =>
      selected
        ? Object.entries(selected as unknown as Record<string, unknown>)
        : [],
    [selected],
  );

  return (
    <div className="min-h-[32rem] w-full">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {currentConfig.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {currentConfig.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor={`${kind}-date-filter`}>
            Date range
          </label>
          <select
            id={`${kind}-date-filter`}
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(
                event.target.value as AccountActivityDateRequest["dateFilter"],
              )
            }
            className="rounded-lg border border-[#DDE4EC] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#193F7F]"
          >
            {filters.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {dateFilter === "CUSTOM_RANGE" && (
            <>
              <input
                aria-label="Start date"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-lg border border-[#DDE4EC] px-3 py-2 text-sm"
              />
              <input
                aria-label="End date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-lg border border-[#DDE4EC] px-3 py-2 text-sm"
              />
            </>
          )}
        </div>
      </div>

      <Table className="w-full min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#777]">
              S/N
            </TableHead>
            {currentConfig.columns.map((column) => (
              <TableHead
                key={column.key}
                className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#777]"
              >
                {column.label}
              </TableHead>
            ))}
            <TableHead className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#777]">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-white">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                <TableCell
                  colSpan={currentConfig.columns.length + 2}
                  className="px-4 py-5"
                >
                  <div className="h-4 rounded bg-slate-100" />
                </TableCell>
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={currentConfig.columns.length + 2}
                className="px-6 py-16 text-center text-sm text-gray-500"
              >
                No records found for this date range.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => {
              const record = row as unknown as Record<string, unknown>;
              return (
                <TableRow
                  key={String(record.id ?? record.auditLogId ?? index)}
                  className="transition-colors hover:bg-gray-50"
                >
                  <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                    {(currentPage - 1) * 20 + index + 1}
                  </TableCell>
                  {currentConfig.columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="max-w-[220px] truncate whitespace-nowrap px-4 py-4 text-sm text-gray-700"
                    >
                      {column.format === "status" ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                          {displayValue(record[column.key])}
                        </span>
                      ) : (
                        displayValue(record[column.key], column.format)
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-4">
                    <button
                      onClick={() => setSelected(row)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:translate-y-px"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {!loading && rows.length > 0 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentConfig.title} details</DialogTitle>
            <DialogDescription>
              Complete profile and audit context for this record.
            </DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {details.map(([key, value]) => (
              <div
                key={key}
                className={`border-t border-gray-100 py-3 ${typeof value === "object" || String(value ?? "").length > 80 ? "sm:col-span-2" : ""}`}
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {key.replace(/([A-Z])/g, " $1")}
                </dt>
                <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-900">
                  {displayValue(
                    value,
                    key.toLowerCase().includes("at") ||
                      key.toLowerCase().includes("timestamp")
                      ? "date"
                      : undefined,
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </DialogContent>
      </Dialog>
    </div>
  );
}

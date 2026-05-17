"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Download,
  Eye,
  FileText,
  Loader2,
  Play,
  Rows3,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import LoadingIndicator from "@/components/LoadingIndicator";
import Pagination from "@/components/Pagination";
import { reportService } from "@/services/report";
import { GeneratedReport, ReportPreviewRow } from "@/types/common";
import { ReportRequest } from "@/types/request";
import { ReportPreviewResponse } from "@/types/response";
import { downloadBlob, formatNumber } from "@/lib/utils";
import { useStore } from "@/store";

const reportTypes = [
  "TRANSACTION_SUMMARY_REPORT",
  "FAILED_TRANSACTIONS_REPORT",
  "PENDING_TRANSACTIONS_REPORT",
  "REVERSAL_PENDING_REPORT",
  "BILL_PAYMENT_REPORT",
  "TRANSFER_REPORT",
  "USER_ENROLLMENT_REPORT",
  "SECURITY_EVENTS_REPORT",
  "EXCEPTION_SUMMARY_REPORT",
];

const dateRanges = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
  "ALL_DATES",
  "CUSTOM_RANGE",
];

const serviceTypes = [
  "ALL_SERVICES",
  "INTERBANK",
  "JAIZ_TO_JAIZ",
  "BILL_PAYMENT",
  "AIRTIME",
  "DATA",
  "ELECTRICITY",
];

const statusFilters = ["ALL_STATUS", "SUCCESSFUL", "FAILED", "PENDING"];

const formatOption = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

const ReportsPage = () => {
  const user = useStore((state) => state.user);
  const [reportType, setReportType] = useState("TRANSACTION_SUMMARY_REPORT");
  const [dateRange, setDateRange] = useState("LAST_7_DAYS");
  const [serviceType, setServiceType] = useState("ALL_SERVICES");
  const [statusFilter, setStatusFilter] = useState("ALL_STATUS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preview, setPreview] = useState<ReportPreviewResponse | null>(null);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [downloadId, setDownloadId] = useState("");

  const request: ReportRequest = useMemo(
    () => ({
      reportType,
      dateRange,
      serviceType,
      statusFilter,
      format: "CSV",
      ...(dateRange === "CUSTOM_RANGE" && startDate && { startDate }),
      ...(dateRange === "CUSTOM_RANGE" && endDate && { endDate }),
    }),
    [dateRange, endDate, reportType, serviceType, startDate, statusFilter],
  );

  const trendData = useMemo(() => {
    const grouped = reports.reduce<Record<string, number>>((acc, report) => {
      const key = dayjs(report.generatedAt).format("DD MMM");
      acc[key] = (acc[key] || 0) + report.rows;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, rows]) => ({ date, rows }));
  }, [reports]);

  const getReports = async () => {
    try {
      setLoading(true);
      const { data } = await reportService.getGeneratedReports({
        page: currentPage - 1,
        size: 10,
        sortBy: "generatedAt",
      });
      setReports(data.content);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to fetch generated reports");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (dateRange === "CUSTOM_RANGE" && (!startDate || !endDate)) {
      toast.error("Select a start and end date");
      return;
    }

    try {
      setPreviewLoading(true);
      const { data } = await reportService.preview(request);
      setPreview(data);
    } catch {
      toast.error("Failed to preview report");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (dateRange === "CUSTOM_RANGE" && (!startDate || !endDate)) {
      toast.error("Select a start and end date");
      return;
    }

    try {
      setGenerateLoading(true);
      await reportService.generate(
        request,
        user.email || user.username || "System",
      );
      toast.success("Report generated");
      if (currentPage === 1) getReports();
      else setCurrentPage(1);
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleDownload = async (report: GeneratedReport) => {
    try {
      setDownloadId(report.id);
      const response = await reportService.download(report.id);
      downloadBlob(response.data, report.fileName || `report_${report.id}.csv`);
    } catch {
      toast.error("Failed to download report");
    } finally {
      setDownloadId("");
    }
  };

  useEffect(() => {
    getReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="px-6">
      {loading && <LoadingIndicator />}

      <div className="flex items-center mb-6">
        <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
        <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="bg-white border border-[#EEEEEE] rounded-full px-4 py-3 text-sm outline-none"
            >
              {reportTypes.map((item) => (
                <option key={item} value={item}>
                  {formatOption(item)}
                </option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white border border-[#EEEEEE] rounded-full px-4 py-3 text-sm outline-none"
            >
              {dateRanges.map((item) => (
                <option key={item} value={item}>
                  {formatOption(item)}
                </option>
              ))}
            </select>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="bg-white border border-[#EEEEEE] rounded-full px-4 py-3 text-sm outline-none"
            >
              {serviceTypes.map((item) => (
                <option key={item} value={item}>
                  {formatOption(item)}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#EEEEEE] rounded-full px-4 py-3 text-sm outline-none"
            >
              {statusFilters.map((item) => (
                <option key={item} value={item}>
                  {formatOption(item)}
                </option>
              ))}
            </select>
          </div>

          {dateRange === "CUSTOM_RANGE" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-[#EEEEEE] rounded-full px-4 py-3 text-sm outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-[#EEEEEE] rounded-full px-4 py-3 text-sm outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handlePreview}
              disabled={previewLoading}
              className="bg-white border border-[#193F7F] text-[#193F7F] px-4 py-3 text-sm rounded-full transition-colors flex items-center space-x-2 disabled:opacity-60"
            >
              {previewLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span>Preview</span>
            </button>
            <button
              onClick={handleGenerate}
              disabled={generateLoading}
              className="bg-[#193F7F] text-white px-4 py-3 text-sm rounded-full transition-colors flex items-center space-x-2 disabled:opacity-60"
            >
              {generateLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>Generate Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-[#F7F8FA] rounded-lg p-4">
              <FileText className="h-5 w-5 text-[#193F7F] mb-2" />
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(preview?.totalRows || 0)}
              </p>
              <p className="text-sm text-gray-600">Preview Total Rows</p>
            </div>
            <div className="bg-[#F7F8FA] rounded-lg p-4">
              <Rows3 className="h-5 w-5 text-[#193F7F] mb-2" />
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(reports.length)}
              </p>
              <p className="text-sm text-gray-600">Reports On This Page</p>
            </div>
            <div className="bg-[#F7F8FA] rounded-lg p-4">
              <Download className="h-5 w-5 text-[#193F7F] mb-2" />
              <p className="text-xl font-bold text-gray-900">CSV</p>
              <p className="text-sm text-gray-600">Export Format</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Generated Rows Trend
          </h2>
          <div className="h-74">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rows"
                  stroke="#193F7F"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {preview && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              {preview.reportName} Preview
            </h2>
            <span className="text-sm text-gray-500">
              {preview.sampleSize} of {preview.totalRows} rows
            </span>
          </div>
          <ReportRowsTable rows={preview.rows} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Generated Reports
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-[#F7F8FA] border-b border-[#EEEEEE]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                Filters
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                Generated By
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                Rows
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="font-medium">{report.reportName}</div>
                  <div className="text-xs text-gray-500">
                    {dayjs(report.generatedAt).format("DD/MM/YYYY hh:mm A")}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{formatOption(report.dateRange)}</div>
                  <div className="text-xs text-gray-500">
                    {formatOption(report.serviceType)} •{" "}
                    {formatOption(report.statusFilter)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {report.generatedBy}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatNumber(report.rows)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDownload(report)}
                    disabled={downloadId === report.id}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 disabled:opacity-60"
                  >
                    {downloadId === report.id ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-1 h-4 w-4" />
                    )}
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

const ReportRowsTable = ({ rows }: { rows: ReportPreviewRow[] }) => (
  <table className="w-full">
    <thead className="bg-[#F7F8FA] border-b border-[#EEEEEE]">
      <tr>
        {[
          "Reference",
          "Date",
          "Channel",
          "Type",
          "Amount",
          "Status",
          "Details",
        ].map((item) => (
          <th
            key={item}
            className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider"
          >
            {item}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {rows.map((row) => (
        <tr
          key={`${row.reference}-${row.date}`}
          className="hover:bg-gray-50 transition-colors duration-150"
        >
          <td className="px-6 py-4 text-sm text-gray-900">{row.reference}</td>
          <td className="px-6 py-4 text-sm text-gray-900">
            {dayjs(row.date).format("DD/MM/YYYY hh:mm A")}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">{row.channel}</td>
          <td className="px-6 py-4 text-sm text-gray-900">{row.type}</td>
          <td className="px-6 py-4 text-sm text-gray-900">
            {formatNumber(row.amount)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                row.status === "SUCCESSFUL" || row.status === "SUCCESS"
                  ? "bg-green-100 text-green-800"
                  : row.status === "FAILED"
                    ? "bg-red-100 text-red-800"
                    : "bg-orange-100 text-orange-800"
              }`}
            >
              {row.status}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">{row.details}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ReportsPage;

"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import LoadingIndicator from "@/components/LoadingIndicator";
import Pagination from "@/components/Pagination";
import {
  getBeneficiaryAccount,
  getSourceAccount,
  getTransactionAmount,
  getTransactionReference,
  getTransactionStatus,
  getTransactionTimestamp,
} from "@/lib/transactions";
import { formatNumber, formatTimestamp } from "@/lib/utils";
import { transactionService } from "@/services/transaction";
import { Transaction } from "@/types/common";
import { TransactionListRequest } from "@/types/request";

const dateFilters = [
  "TODAY",
  "YESTERDAY",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
  "THIS_MONTH",
  "ALL_TIME",
  "CUSTOM_RANGE",
];

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

const FailedTransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [dateFilter, setDateFilter] = useState("TODAY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const params: TransactionListRequest = useMemo(
    () => ({
      page: currentPage - 1,
      size: 10,
      status: "FAILED",
      dateFilter,
      ...(dateFilter === "CUSTOM_RANGE" && startDate && { startDate }),
      ...(dateFilter === "CUSTOM_RANGE" && endDate && { endDate }),
    }),
    [currentPage, dateFilter, endDate, startDate],
  );

  const getFailedTransactions = async () => {
    if (dateFilter === "CUSTOM_RANGE" && (!startDate || !endDate)) return;

    try {
      setLoading(true);
      const { data } = await transactionService.getTransactions(params);
      setTransactions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch {
      toast.error("Failed to fetch failed transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFailedTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <section className="relative my-8 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      {loading && <LoadingIndicator />}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center">
          <div className="mr-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Failed Transactions
            </h2>
            <p className="text-sm text-slate-500">
              {formatNumber(totalElements)} failed transactions
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateFilter}
            onChange={(event) => {
              setDateFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="min-w-[165px] rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm outline-none"
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
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm outline-none"
              />
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#EEF1F4]">
        <table className="w-full min-w-[920px]">
          <thead className="border-b border-[#EEEEEE] bg-[#F7F8FA]">
            <tr>
              {[
                "S/N",
                "Transaction ID",
                "Amount",
                "Source Account",
                "Beneficiary Account",
                "Timestamp",
                "Status",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#9C9C9C]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className="transition-colors duration-150 hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {(currentPage - 1) * 10 + index + 1}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {getTransactionReference(transaction)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {formatNumber(getTransactionAmount(transaction))}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {getSourceAccount(transaction)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {getBeneficiaryAccount(transaction)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-700">
                  {formatTimestamp(
                    getTransactionTimestamp(transaction),
                    "YYYY-MM-DD",
                  )}{" "}
                  •{" "}
                  {formatTimestamp(
                    getTransactionTimestamp(transaction),
                    "hh:mm A",
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    {formatLabel(getTransactionStatus(transaction))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && transactions.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500">
            No failed transactions found for this date filter.
          </div>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </section>
  );
};

export default FailedTransactionsTable;

"use client";
import { TableActionPopover } from "@/components/ui/table-action-popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { FunnelIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { AuditLog as AuditLogType } from "@/types/common";
import { auditLogService } from "@/services/audit-log";
import { toast } from "sonner";
import { useDebounce } from "react-use";
import { PaginatedRequest } from "@/types/request";
import { downloadCsvFromString, formatTimestamp } from "@/lib/utils";
import LoadingIndicator from "../LoadingIndicator";
import Pagination from "../Pagination";
import AuditLogDetails from "../modals/AuditLogDetails";
import { exportService } from "@/services/export";
import { usePermissions } from "@/hooks/use-permissions";

const AuditLog = () => {
  const { hasPermission } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [initialSearchTerm, setInitialSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL_TIME");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [userActivities, setUserActivities] = useState<AuditLogType[]>([]);

  // Modal state
  const [selectedLog, setSelectedLog] = useState<AuditLogType | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useDebounce(
    () => {
      setSearchTerm(debouncedSearchTerm);
    },
    2000,
    [debouncedSearchTerm],
  );

  const getAuditLogs = async () => {
    const params: PaginatedRequest = {
      page: currentPage - 1,
      size: 10,
    };
    if (searchTerm) params.search = searchTerm;
    try {
      setLoading(true);
      const response = await auditLogService.getLogs(params);
      setUserActivities(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch {
      toast.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await exportService.audit(selectedFilter);
      downloadCsvFromString(response.data, "audit-logs");
    } catch {
      toast.error("Failed to export audit logs");
    } finally {
      setLoading(false);
    }
  };



  const handleAction = (action: string, logId: number) => {
    if (action === "edit") {
      const log = userActivities.find((l) => l.id === logId);
      console.log({ log });
      if (log) {
        setSelectedLog(log);
        setIsDetailsOpen(true);
      }
    } else {
      console.log(`${action} for log ${logId}`);
    }
    setShowDropdown(null);
  };

  useEffect(() => {
    getAuditLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  return (
    <div className="w-full min-h-screen">
      {loading && <LoadingIndicator />}
      {/* Main Content */}
      {/* <div className="px-4 sm:px-6 lg:px-8 py-8"> */}
      <div className="">
        <div>
          {/* Header with title indicator */}
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
            <h1 className="text-xl font-semibold text-gray-900">Audit Logs</h1>
          </div>

          {/* Header Section */}
          <div className="flex w-full justify-between items-center my-10">
            <div className="flex items-center flex-2/4 h-5 bg-white p-4  pr-4 py-6 mr-8 border border-[#EEEEEE] rounded-full ">
              <MagnifyingGlassIcon className="w-6 h-6 text-[#dddddd]" />
              <div className=" h-9.5 pl-4 border-[#dddddd] border-r"></div>
              <input
                placeholder="Search by name"
                value={initialSearchTerm}
                onChange={(e) => setInitialSearchTerm(e.target.value)}
                onKeyDown={() => setDebouncedSearchTerm(initialSearchTerm)}
                className=" flex flex-1 pl-6 text-sm focus:outline-none focus:border-transparent"
              />
            </div>

            <div className="flex w-full items-center flex-1/4 h-5 bg-white p-4  pr-4 py-6 mr-8 border border-gray-200 rounded-full">
              <div className="flex flex-1 items-center space-x-2">
                <span className="text-xs text-[#dddddd] flex flex-row items-center">
                  Filter by
                  <FunnelIcon className="w-4 h-4 ml-1 text-[#dddddd]" />{" "}
                </span>
                <div className=" h-[38px] pl-2 border-[#dddddd] border-r-1"></div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="flex flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-transparent"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="ALL_TIME">All Time</option>
                </select>
              </div>
            </div>

            {hasPermission("audit:export") && <button
              onClick={handleExport}
              className=" bg-[#193F7F] text-center    text-white px-4 py-3 text-sm rounded-full  transition-colors flex items-center space-x-2"
            >
              <ArrowUpOnSquareIcon className="h-4 w-4" />
              <span>Export Audit Report</span>
            </button>}
          </div>

          {/* Users Table */}
          <div className=" rounded-lg">
            <div>
              <Table className="w-full">
                <TableHeader className="bg-[#F7F8FA] border-b border-[#EEEEEE]">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      S/N
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Username
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Role
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Action
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Timestamp
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      IP Address
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {userActivities.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {/* {user.role} */}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.action}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-xs whitespace-nowrap">
                        {formatTimestamp(user.timestamp, "DD-MM-YYYY")} •{" "}
                        {formatTimestamp(user.timestamp, "hh:mm A")}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {user.ipAddress}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                        <TableActionPopover
                          open={showDropdown === user.id}
                          onOpenChange={(open) =>
                            setShowDropdown(open ? user.id : null)
                          }
                        >
                          <button
                                  onClick={() => handleAction("edit", user.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                >
                                  View Details
                                </button>
                                {/* <button
                                  onClick={() =>
                                    handleAction("delete", user.id)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                >
                                  Flag Activity
                                </button> */}
                        </TableActionPopover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Audit Log Details Modal */}
      <AuditLogDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        auditLog={selectedLog}
      />
    </div>
  );
};

export default AuditLog;

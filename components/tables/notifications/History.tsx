"use client";
import { useEffect, useState } from "react";
import { ChevronDown, FunnelIcon, Megaphone } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useDebounce } from "react-use";
import { notificationService } from "@/services/notification";
import { Notification } from "@/types/common";
import dayjs from "dayjs";
import CreateNewBroadcast from "@/components/modals/CreateNewBroadcast";
import { PaginatedRequest } from "@/types/request";
import Pagination from "@/components/Pagination";
import LoadingIndicator from "@/components/LoadingIndicator";

const BroadcastHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [initialSearchTerm, setInitialSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Select filter");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [openNew, setOpenNew] = useState(false);
  const [loading, setLoading] = useState(false);

  useDebounce(
    () => {
      setSearchTerm(debouncedSearchTerm);
    },
    2000,
    [debouncedSearchTerm],
  );

  const getNotifications = async () => {
    const params: PaginatedRequest = {
      page: currentPage - 1,
      size: 10,
    };
    if (searchTerm) params.search = searchTerm;
    if (selectedFilter && selectedFilter !== "Select filter")
      params.sortBy = selectedFilter;
    try {
      setLoading(true);
      const { data } = await notificationService.getAllNotifications(params);
      setNotifications(data.content);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data.error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const handleAction = (action: string, id: string) => {
    console.log(`${action} for broadcast ${id}`);
    setShowDropdown(null);
  };

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, selectedFilter]);

  return (
    <div className="w-full min-h-screen">
      {loading && <LoadingIndicator />}
      <div className="">
        {/* Header with title indicator */}
        <div className="flex items-center mb-6">
          <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
          <h1 className="text-xl font-semibold text-gray-900">
            Broadcast History
          </h1>
        </div>

        {/* Top Controls */}
        <div className="flex w-full justify-between items-center my-10">
          {/* Search */}
          <div className="flex items-center flex-2/4 h-5 bg-white p-4 pr-4 py-6 mr-8 border border-[#EEEEEE] rounded-full">
            <MagnifyingGlassIcon className="w-6 h-6 text-[#dddddd]" />
            <div className="h-9.5 pl-4 border-[#dddddd] border-r"></div>
            <input
              placeholder="Search by name"
              value={initialSearchTerm}
              onChange={(e) => setInitialSearchTerm(e.target.value)}
              onKeyDown={() => setDebouncedSearchTerm(initialSearchTerm)}
              className="flex flex-1 pl-6 text-sm focus:outline-none focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex w-full items-center flex-1/4 h-5 bg-white p-4 pr-4 py-6 mr-8 border border-[#EEEEEE] rounded-full">
            <div className="flex flex-1 items-center space-x-2">
              <span className="text-xs text-[#dddddd] flex flex-row items-center">
                Filter by
                <FunnelIcon className="w-4 h-4 ml-1 text-[#dddddd]" />
              </span>
              <div className="h-9.5 pl-2 border-[#dddddd] border-r"></div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-white w-full flex-3/5 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none pr-8"
              >
                <option>Select filter</option>
                <option value="title">Title</option>
                <option value="message">Message</option>
                <option value="createdAt">Date Created</option>
                <option value="sentAt">Date Sent</option>
                <option value="scheduledAt">Date Scheduled</option>
              </select>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setOpenNew(true)}
            className="bg-[#193F7F] text-white px-4 py-3 text-sm rounded-full transition-colors flex items-center space-x-2"
          >
            <Megaphone className="h-4 w-4" />
            <span>Send New Broadcast</span>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg">
          <div>
            <table className="w-full">
              <thead className="bg-[#F7F8FA] border-b border-[#EEEEEE]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                    Audience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                    Sent At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {idx + 1}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 max-w-105">
                      <div className="leading-5">{item.message}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.type}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                      {dayjs(item.createdAt).format("DD/MM/YYYY")} •{" "}
                      {dayjs(item.createdAt).format("hh:mm A")}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleDropdown(item.id)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
                        >
                          Actions
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </button>

                        {showDropdown === item.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#EEEEEE] z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleAction("view", item.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() =>
                                  handleAction("duplicate", item.id)
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleAction("delete", item.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      <CreateNewBroadcast
        open={openNew}
        onOpenChange={setOpenNew}
        onSuccess={getNotifications}
      />

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(null)}
        ></div>
      )}
    </div>
  );
};

export default BroadcastHistory;

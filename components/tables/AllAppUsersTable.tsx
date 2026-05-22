"use client";
import { useEffect, useState } from "react";
import { ChevronDown, FunnelIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { AppUser } from "@/types/common";
import { userService } from "@/services/user";
import { PaginatedRequest } from "@/types/request";
import { useDebounce } from "react-use";
import Pagination from "../Pagination";
import LoadingIndicator from "../LoadingIndicator";
import { toast } from "sonner";
import ConfirmModal from "../modals/ConfirmModal";
import { useStore } from "@/store";
import { formatRelativeTimestamp } from "@/lib/utils";

const AllAppUsersTable = () => {
  const authUser = useStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialSearchTerm, setInitialSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Select filter");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);

  useDebounce(
    () => {
      setSearchTerm(debouncedSearchTerm);
    },
    2000,
    [debouncedSearchTerm],
  );

  const getUsers = async () => {
    const params: PaginatedRequest = {
      page: currentPage - 1,
      size: 10,
    };
    if (searchTerm) params.search = searchTerm;
    if (selectedFilter && selectedFilter !== "Select filter")
      params.sortBy = selectedFilter;
    try {
      setLoading(true);
      const response = await userService.getAppUsers(params);
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (userId: string) => {
    setShowDropdown(showDropdown === userId ? null : userId);
  };

  const handleAction = (action: string, user: AppUser) => {
    setSelectedUser(user);
    setShowDropdown(null);
    if (action === "unlock" && user.accountLocked) {
      setConfirmModal(true);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, selectedFilter]);

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
            <h1 className="text-xl font-semibold text-gray-900">All Users</h1>
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

            <div className="flex w-full items-center flex-1/4 h-5 bg-white p-4  pr-4 py-6 mr-8 border border-[#EEEEEE] rounded-full">
              <div className="flex flex-1 items-center space-x-2">
                <span className="text-xs text-[#dddddd] flex flex-row items-center">
                  Filter by
                  <FunnelIcon className="w-4 h-4 ml-1 text-[#dddddd]" />{" "}
                </span>
                <div className=" h-9.5 pl-2 border-[#dddddd] border-r"></div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-white  w-full flex-3/5  rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none pr-8"
                >
                  <option>Select filter</option>
                  <option value="firstName">First Name</option>
                  <option value="lastName">Last Name</option>
                  <option value="dateTimeCreated">Date Created</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className=" rounded-lg">
            <div>
              <table className="w-full">
                <thead className="bg-[#F7F8FA] border-b border-[#EEEEEE]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      S/N
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      First Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Last Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Login Pin Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Account Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.firstName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.hasLoginPin
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.hasLoginPin ? "Has Login Pin" : "No Login Pin"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            !user.accountLocked
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.accountLocked ? "Account Locked" : "Account Unlocked"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatRelativeTimestamp(user.dateTimeModified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleDropdown(user.id)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
                          >
                            Actions
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {showDropdown === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#EEEEEE] z-10">
                              <div className="py-1">
                                <button
                                  disabled={!user.accountLocked}
                                  onClick={() => handleAction("unlock", user)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 disabled:cursor-not-allowed disabled:text-gray-400"
                                >
                                  Unlock Account
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmModal}
        onOpenChange={setConfirmModal}
        onSuccess={getUsers}
        title={`Unclock ${selectedUser?.firstName} ${selectedUser?.lastName}'s Account?`}
        description={`Are you sure you want to unlock ${selectedUser?.firstName} ${selectedUser?.lastName}'s account?`}
        successTitle="Account Unlocked"
        successDescription={`${selectedUser?.firstName} ${selectedUser?.lastName}'s account has been successfully unlocked.`}
        onProceed={() => userService.unlockUser(selectedUser?.userId || "", authUser?.userId || "")}
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

export default AllAppUsersTable;

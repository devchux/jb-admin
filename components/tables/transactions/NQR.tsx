"use client";
import { useEffect, useState } from "react";
import { ChevronDown, FunnelIcon, UserIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Transaction } from "@/types/common";
import { transactionService } from "@/services/transaction";
import Pagination from "@/components/Pagination";
import LoadingIndicator from "@/components/LoadingIndicator";
import dayjs from "dayjs";

const NQRTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Select filter");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const getTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getNQRTransactions({
        page: currentPage - 1,
        size: 10,
      });
      setTransactions(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (userId: string | null) => {
    setShowDropdown(showDropdown === userId ? null : userId);
  };

  const handleAction = (action: string, userId: string) => {
    console.log(`${action} for user ${userId}`);
    setShowDropdown(null);
  };

  useEffect(() => {
    (async () => await getTransactions())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
            <h1 className="text-xl font-semibold text-gray-900">
              NQR Transactions
            </h1>
          </div>

          {/* Header Section */}
          <div className="flex w-full justify-between items-center my-[40px]">
            <div className="flex items-center flex-2/4 h-5 bg-white p-4  pr-4 py-6 mr-8 border border-[#EEEEEE] rounded-full ">
              <MagnifyingGlassIcon className="w-6 h-6 text-[#dddddd]" />
              <div className=" h-[38px] pl-4 border-[#dddddd] border-r-1"></div>
              <input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" flex flex-1 pl-6 text-sm focus:outline-none focus:border-transparent"
              />
            </div>

            <div className="flex w-full items-center flex-1/4 h-5 bg-white p-4  pr-4 py-6 mr-8 border border-[#EEEEEE] rounded-full">
              <div className="flex flex-1 items-center space-x-2">
                <span className="text-xs text-[#dddddd] flex flex-row items-center">
                  Account
                  <UserIcon className="w-4 h-4 ml-1 text-[#dddddd]" />{" "}
                </span>
                <div className=" h-[38px] pl-2 border-[#dddddd] border-r-1"></div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-white  w-full flex-3/5  rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none pr-8"
                >
                  <option>All Accounts</option>
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Financial Officer</option>
                </select>
              </div>
            </div>

            <div className="flex w-full items-center flex-1/4 h-5 bg-white p-4  pr-4 py-6 mr-8 border border-[#EEEEEE] rounded-full">
              <div className="flex flex-1 items-center space-x-2">
                <span className="text-xs text-[#dddddd] flex flex-row items-center">
                  Filter by
                  <FunnelIcon className="w-4 h-4 ml-1 text-[#dddddd]" />{" "}
                </span>
                <div className=" h-[38px] pl-2 border-[#dddddd] border-r-1"></div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-white  w-full flex-3/5  rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none pr-8"
                >
                  <option>Select filter</option>
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Financial Officer</option>
                </select>
              </div>
            </div>

            {/* <button className=" bg-[#193F7F] text-center    text-white px-4 py-3 text-sm rounded-full  transition-colors flex items-center space-x-2">
              <ArrowUpOnSquareIcon className="h-4 w-4" />
              <span>Export Audit Report</span>
            </button> */}
          </div>

          {/* Users Table */}
          <div className=" rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F7F8FA] border-b border-[#EEEEEE]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      S/N
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Transaction Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Source User Account
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Beneficiary Account
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.data.transactionKey}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.data.accountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.creditAccount}
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap">
                        {dayjs(item.data.activationDate).format("YYYY-MM-DD")} •{" "}
                        {dayjs(item.data.activationDate).format("hh:mm A")}
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

                          {/* Dropdown Menu */}
                          {showDropdown === item.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#EEEEEE] z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleAction("edit", item.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                >
                                  View Details
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
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

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

export default NQRTransactions;

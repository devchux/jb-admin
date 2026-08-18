"use client";
import { TableActionPopover } from "@/components/ui/table-action-popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { ChevronLeft, ChevronRight, FunnelIcon, UserIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const CardPOS = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Select filter");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const transactions = [
    {
      sn: 1,
      transactionId: "NGNX79EE544RXUE780",
      transactionAmount: "1,000.00",
      sourceUserAccount: "Admin",
      beneficiaryAccount: "Admin",
      date: "2025-07-20",
      time: "10:35 PM",
    },
    {
      sn: 2,
      transactionId: "NGNX79EE544RXUE780",
      transactionAmount: "75,000,000.00",
      sourceUserAccount: "Editor",
      beneficiaryAccount: "Editor",
      date: "2025-07-20",
      time: "10:35 PM",
    },
    {
      sn: 3,
      transactionId: "NGNX79EE544RXUE780",
      transactionAmount: "324,026.09",
      sourceUserAccount: "Viewer",
      beneficiaryAccount: "Viewer",
      date: "2025-07-20",
      time: "10:35 PM",
    },
    {
      sn: 4,
      transactionId: "NGNX79EE544RXUE780",
      transactionAmount: "324,026.09",
      sourceUserAccount: "Admin",
      beneficiaryAccount: "Admin",
      date: "2025-07-20",
      time: "10:35 PM",
    },
  ];



  const handleAction = (action: string, userId: number) => {
    console.log(`${action} for user ${userId}`);
    setShowDropdown(null);
  };

  return (
    <div className="w-full min-h-screen">
      {/* Main Content */}
      {/* <div className="px-4 sm:px-6 lg:px-8 py-8"> */}
      <div className="">
        <div>
          {/* Header with title indicator */}
          <div className="flex items-center mb-6">
            <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
            <h1 className="text-xl font-semibold text-gray-900">
              Card POS Transactions
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
          <div className=" rounded-lg">
            <div>
              <Table className="w-full">
                <TableHeader className="bg-[#F7F8FA] border-b border-[#EEEEEE]">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      S/N
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Transaction ID
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Transaction Amount
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Source User Account
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Beneficiary Account
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Timestamp
                    </TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {transactions.map((item, index) => (
                    <TableRow
                      key={item.sn}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.transactionId}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.transactionAmount}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.sourceUserAccount}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.beneficiaryAccount}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-xs whitespace-nowrap">
                        {item.date} • {item.time}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                        <TableActionPopover
                          open={showDropdown === item.sn}
                          onOpenChange={(open) =>
                            setShowDropdown(open ? item.sn : null)
                          }
                        >
                          <button
                                  onClick={() => handleAction("edit", item.sn)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                >
                                  Edit User Details
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction("deactivate", item.sn)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                >
                                  Deactivate
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction("delete", item.sn)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                >
                                  Delete User
                                </button>
                        </TableActionPopover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-[#EEEEEE]">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <span className="text-gray-500">...</span>
                  {[8, 9, 10].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-150"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPOS;

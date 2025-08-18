'use client';
import { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FunnelIcon,
} from 'lucide-react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

const AuditLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Select filter');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(null);

  const userActivities = [
    {
      id: 1,
      userName: 'Abdul Isaq',
      role: 'Super Admin',
      action: 'User login',
      timestamp: '2025-07-20',
      time: '10:35 PM',
      ipAddress: '192.168.1.100',
    },
    {
      id: 2,
      userName: 'Jemima Adetayo',
      role: 'Admin',
      action: 'Edited Customer care role',
      timestamp: '2025-07-20',
      time: '10:35 PM',
      ipAddress: '192.168.1',
    },
    {
      id: 3,
      userName: 'Bello Musa',
      role: 'Editor',
      action: 'User logout',
      timestamp: '2025-07-20',
      time: '10:35 PM',
      ipAddress: '192.168.1.129',
    },
    {
      id: 4,
      userName: 'Ridwan Suleja',
      role: 'Finance Officer',
      action: 'Export Transaction Report',
      timestamp: '2025-07-20',
      time: '10:35 PM',
      ipAddress: '192.168.1.265',
    },
  ];

  const filteredUsers = userActivities.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = (userId) => {
    setShowDropdown(showDropdown === userId ? null : userId);
  };

  const handleAction = (action, userId) => {
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
            <h1 className="text-xl font-semibold text-gray-900">Audit Logs</h1>
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
                  Filter by
                  <FunnelIcon className="w-4 h-4 ml-1 text-[#dddddd]" />{' '}
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

            <button className=" bg-[#193F7F] text-center    text-white px-4 py-3 text-sm rounded-full  transition-colors flex items-center space-x-2">
              <ArrowUpOnSquareIcon className="h-4 w-4" />
              <span>Export Audit Report</span>
            </button>
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
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#9C9C9C] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.action}
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap">
                        {user.timestamp} • {user.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {user.ipAddress}
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
                                  onClick={() => handleAction('edit', user.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                >
                                  Edit User Details
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction('deactivate', user.id)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                >
                                  Deactivate
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction('delete', user.id)
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                >
                                  Delete User
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
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
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
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
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

export default AuditLog;

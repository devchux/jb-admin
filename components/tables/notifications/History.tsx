'use client';
import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FunnelIcon,
  Megaphone,
} from 'lucide-react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const BroadcastHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Select filter');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const broadcasts = [
    {
      id: 1,
      message: "Hello team, we're excited to announce our new product launch!",
      audience: 'All Members',
      date: '2025-07-20',
      time: '10:35 PM',
    },
    {
      id: 2,
      message: 'Urgent: System maintenance scheduled for tonight.',
      audience: 'Specific group',
      date: '2025-07-20',
      time: '10:35 PM',
    },
    {
      id: 3,
      message: 'Important update regarding the upcoming conference.',
      audience: 'All Members',
      date: '2025-07-20',
      time: '10:35 PM',
    },
    {
      id: 4,
      message: 'New feature release: Check out the latest updates!',
      audience: 'All Members',
      date: '2025-07-20',
      time: '10:35 PM',
    },
  ];

  const toggleDropdown = (id: number) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const handleAction = (action: string, id: number) => {
    console.log(`${action} for broadcast ${id}`);
    setShowDropdown(null);
  };

  const filtered = useMemo(() => {
    let rows = broadcasts;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      rows = rows.filter((r) => r.message.toLowerCase().includes(q));
    }
    if (selectedFilter !== 'Select filter' && selectedFilter !== 'All') {
      rows = rows.filter((r) => r.audience === selectedFilter);
    }
    return rows;
  }, [searchTerm, selectedFilter]);

  return (
    <div className="w-full min-h-screen">
      <div className="">
        {/* Header with title indicator */}
        <div className="flex items-center mb-6">
          <div className="w-3 h-8 bg-[#193F7F] rounded-full mr-3"></div>
          <h1 className="text-xl font-semibold text-gray-900">
            Broadcast History
          </h1>
        </div>

        {/* Top Controls */}
        <div className="flex w-full justify-between items-center my-[40px]">
          {/* Search */}
          <div className="flex items-center flex-2/4 h-5 bg-white p-4 pr-4 py-6 mr-8 border border-[#EEEEEE] rounded-full">
            <MagnifyingGlassIcon className="w-6 h-6 text-[#dddddd]" />
            <div className="h-[38px] pl-4 border-[#dddddd] border-r-1"></div>
            <input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <div className="h-[38px] pl-2 border-[#dddddd] border-r-1"></div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-white w-full flex-3/5 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none pr-8"
              >
                <option>Select filter</option>
                <option>All</option>
                <option>All Members</option>
                <option>Specific group</option>
              </select>
            </div>
          </div>

          {/* CTA */}
          <button className="bg-[#193F7F] text-white px-4 py-3 text-sm rounded-full transition-colors flex items-center space-x-2">
            <Megaphone className="h-4 w-4" />
            <span>Send New Broadcast</span>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
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
                {filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {idx + 1}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[420px]">
                      <div className="leading-5">{item.message}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.audience}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                      {item.date} • {item.time}
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
                                onClick={() => handleAction('view', item.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() =>
                                  handleAction('duplicate', item.id)
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleAction('delete', item.id)}
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

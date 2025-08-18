import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

const DashboardCharts = () => {
  const [transactionFilter, setTransactionFilter] = useState('Monthly');
  const [enrollmentFilter, setEnrollmentFilter] = useState('Monthly');

  // Transaction Reports Data
  const transactionData = [
    { day: 1, inflows: 75, outflows: 55 },
    { day: 5, inflows: 50, outflows: 38 },
    { day: 10, inflows: 78, outflows: 22 },
    { day: 15, inflows: 35, outflows: 23 },
    { day: 20, inflows: 85, outflows: 55 },
    { day: 25, inflows: 72, outflows: 48 },
    { day: 30, inflows: 48, outflows: 50 },
  ];

  // Enrollment Reports Data
  const enrollmentData = [
    { day: 1, activeUsers: 75, inactiveUsers: 58 },
    { day: 5, inflows: 48, inactiveUsers: 38 },
    { day: 10, activeUsers: 62, inactiveUsers: 20 },
    { day: 15, activeUsers: 35, inactiveUsers: 22 },
    { day: 20, activeUsers: 85, inactiveUsers: 55 },
    { day: 25, activeUsers: 72, inactiveUsers: 48 },
    { day: 30, activeUsers: 48, inactiveUsers: 50 },
  ];

  const CustomTooltip = ({ content, dataKey }) => {
    if (!content) return null;

    return (
      <div className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium">
        {content}
      </div>
    );
  };

  const ChartContainer = ({
    title,
    data,
    primaryColor,
    secondaryColor,
    primaryKey,
    secondaryKey,
    primaryLabel,
    secondaryLabel,
    filter,
    setFilter,
    highlightIndex = 2,
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-1 h-6 bg-blue-600 rounded"></div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

          <div className="flex items-center space-x-4 ml-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${primaryColor} rounded-full`}></div>
              <span className="text-sm text-gray-600">{primaryLabel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${secondaryColor} rounded-full`}></div>
              <span className="text-sm text-gray-600">{secondaryLabel}</span>
            </div>
          </div>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
            />

            {/* Grid lines */}
            <ReferenceLine y={20} stroke="#E5E7EB" strokeDasharray="2 2" />
            <ReferenceLine y={40} stroke="#E5E7EB" strokeDasharray="2 2" />
            <ReferenceLine y={60} stroke="#E5E7EB" strokeDasharray="2 2" />
            <ReferenceLine y={80} stroke="#E5E7EB" strokeDasharray="2 2" />
            <ReferenceLine y={100} stroke="#E5E7EB" strokeDasharray="2 2" />

            <Bar
              dataKey={primaryKey}
              fill="#22C55E"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-primary-${index}`} fill="#22C55E" />
              ))}
            </Bar>

            <Bar
              dataKey={secondaryKey}
              fill="#F87171"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-secondary-${index}`}
                  fill={secondaryColor === 'bg-red-400' ? '#F87171' : '#9CA3AF'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Highlight tooltip for day 10 */}
        <div className="absolute top-4 left-1/3 transform -translate-x-1/2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium relative">
            {title.includes('Transaction') ? 'N50K' : '52 users'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-600"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-[40px] bg-gray-50">
      <ChartContainer
        title="Transaction Reports"
        data={transactionData}
        primaryColor="bg-green-500"
        secondaryColor="bg-red-400"
        primaryKey="inflows"
        secondaryKey="outflows"
        primaryLabel="Inflows"
        secondaryLabel="Outflows"
        filter={transactionFilter}
        setFilter={setTransactionFilter}
        highlightIndex={2}
      />

      <ChartContainer
        title="Enrollment Reports"
        data={enrollmentData}
        primaryColor="bg-green-500"
        secondaryColor="bg-gray-400"
        primaryKey="activeUsers"
        secondaryKey="inactiveUsers"
        primaryLabel="Active Users"
        secondaryLabel="Inactive Users"
        filter={enrollmentFilter}
        setFilter={setEnrollmentFilter}
        highlightIndex={4}
      />
    </div>
  );
};

export default DashboardCharts;

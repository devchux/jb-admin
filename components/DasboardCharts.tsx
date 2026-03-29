import { dashboardService } from "@/services/dashboard";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import LoadingIndicator from "./LoadingIndicator";

interface DashboardChartsProps {
  dateFilter: string;
  setDateFilter: React.Dispatch<React.SetStateAction<string>>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-600 text-white p-3 border border-gray-100 rounded-lg shadow-lg min-w-[120px]">
        <p className="font-semibold mb-2">{label}</p>
        <div className="flex flex-col gap-1">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-sm capitalize">{entry.name}</span>
              <span className="text-sm font-semibold">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
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
}: // highlightIndex = 2,
{
  title: string;
  data: { label: string; inflow: number; outflow: number }[];
  primaryColor: string;
  secondaryColor: string;
  primaryKey: string;
  secondaryKey: string;
  primaryLabel: string;
  secondaryLabel: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  highlightIndex?: number;
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
        <option value="DAILY">Daily</option>
        <option value="WEEKLY">Weekly</option>
        <option value="MONTHLY">Monthly</option>
        <option value="YEARLY">Yearly</option>
        <option value="ALL_TIME">All Time</option>
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
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(value) => `${value}%`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />

          {/* Grid lines */}
          <ReferenceLine y={20} stroke="#E5E7EB" strokeDasharray="2 2" />
          <ReferenceLine y={40} stroke="#E5E7EB" strokeDasharray="2 2" />
          <ReferenceLine y={60} stroke="#E5E7EB" strokeDasharray="2 2" />
          <ReferenceLine y={80} stroke="#E5E7EB" strokeDasharray="2 2" />
          <ReferenceLine y={100} stroke="#E5E7EB" strokeDasharray="2 2" />

          <Bar
            dataKey={primaryKey}
            name={primaryLabel}
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
            name={secondaryLabel}
            fill="#F87171"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-secondary-${index}`}
                fill={secondaryColor === "bg-red-400" ? "#F87171" : "#9CA3AF"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const DashboardCharts: React.FC<DashboardChartsProps> = () => {
  const [transactionFilter, setTransactionFilter] = useState("ALL_TIME");
  const [enrollmentFilter, setEnrollmentFilter] = useState("ALL_TIME");
  const [userChartLoading, setUserChartLoading] = useState(false);
  const [transactionChartLoading, setTransactionChartLoading] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<
    Array<{
      label: string;
      inflow: number;
      outflow: number;
    }>
  >([]);
  const [transactionData, setTransactionData] = useState<
    Array<{
      label: string;
      inflow: number;
      outflow: number;
    }>
  >([]);

  const getUserCharts = async () => {
    try {
      setUserChartLoading(true);
      const { data } = await dashboardService.getUsersChart(enrollmentFilter);
      const len = data.labels.length;
      const format = new Array(len).fill(null).map((_, index) => ({
        label: data.labels[index],
        inflow: data.inflows[index],
        outflow: data.outflows[index],
      }));
      setEnrollmentData(format);
    } catch {
      toast.error("Failed to fetch users data");
    } finally {
      setUserChartLoading(false);
    }
  };

  const getTrxnCharts = async () => {
    try {
      setTransactionChartLoading(true);
      const { data } =
        await dashboardService.getTransactionsChart(transactionFilter);
      const len = data.labels.length;
      const format = new Array(len).fill(null).map((_, index) => ({
        label: data.labels[index],
        inflow: data.inflows[index],
        outflow: data.outflows[index],
      }));
      setTransactionData(format);
    } catch {
      toast.error("Failed to fetch transactions data");
    } finally {
      setTransactionChartLoading(false);
    }
  };

  useEffect(() => {
    getTrxnCharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionFilter]);

  useEffect(() => {
    getUserCharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollmentFilter]);

  const loading = userChartLoading || transactionChartLoading;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-[40px] bg-gray-50">
      {loading && <LoadingIndicator />}
      <ChartContainer
        title="Transaction Reports"
        data={transactionData}
        primaryColor="bg-green-500"
        secondaryColor="bg-red-400"
        primaryKey="inflow"
        secondaryKey="outflow"
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
        primaryKey="inflow"
        secondaryKey="outflow"
        primaryLabel="Inflows"
        secondaryLabel="Outflows"
        filter={enrollmentFilter}
        setFilter={setEnrollmentFilter}
        highlightIndex={4}
      />
    </div>
  );
};

export default DashboardCharts;

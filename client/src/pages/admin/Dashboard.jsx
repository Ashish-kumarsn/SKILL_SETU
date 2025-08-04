import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Wallet,
  HandCoins,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useGetInstructorStatsQuery,
  useGetInstructorEarningsQuery,
} from "@/features/api/purchaseApi";
import { useTheme } from "next-themes";
import DashboardInsights from "./DashboardInsights";

const useCountUp = (target, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (isNaN(end)) return;

    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);
  return count;
};

const StatBox = ({ title, value, icon }) => {
  const animatedValue = useCountUp(value);
  return (
    <Card className="p-5 bg-gradient-to-br from-[#0f172a] to-[#1e293b] dark:from-[#0f172a] dark:to-[#1e293b] rounded-2xl text-white shadow-lg hover:shadow-xl transition-all">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-white/70 tracking-wide">{title}</p>
          <p className="text-3xl font-bold mt-1">{animatedValue}</p>
        </div>
        <div className="text-4xl bg-white/10 p-3 rounded-xl shadow-inner text-white/90">
          {icon}
        </div>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const { theme } = useTheme();
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetInstructorStatsQuery();

  const {
    data: earningsData,
    isLoading: earningsLoading,
    isError: earningsError,
  } = useGetInstructorEarningsQuery();

  const {
    totalSales = 0,
    totalRevenue = 0,
    totalStudents = 0,
    totalEnrolledCourses = 0,
    totalSubscriptions = 0,
  } = statsData || {};

  const earningsChartData = earningsData?.data || [];

  const [width, setWidth] = useState(300);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 640 ? window.innerWidth - 48 : 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (statsLoading || earningsLoading)
    return <h1 className="text-center text-white mt-10">Loading Dashboard...</h1>;

  if (statsError || earningsError)
    return <h1 className="text-center text-red-500 mt-10">Failed to load dashboard data</h1>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* === STAT CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox title="Total Students" value={totalStudents} icon={<GraduationCap />} />
        <StatBox title="Total Enrolled Courses" value={totalEnrolledCourses} icon={<BookOpen />} />
        <StatBox title="Total Subscriptions" value={totalSubscriptions} icon={<Wallet />} />
        <StatBox title="Total Revenue" value={Math.round(totalRevenue)} icon={<HandCoins />} />
      </div>

      {/* === CHART === */}
      <Card className="bg-gradient-to-br from-[#0f172a] to-[#1e1e2e] dark:from-[#0f172a] dark:to-[#1e1e2e] text-white shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-300">
            Earnings Per Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart width={width} height={300} data={earningsChartData}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                stroke="#cbd5e1"
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: theme === "light" ? "#f1f5f9" : "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: theme === "light" ? "#111" : "#f1f5f9",
                }}
                labelStyle={{ color: theme === "light" ? "#111" : "#f1f5f9" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ stroke: "#22d3ee", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <DashboardInsights />
    </div>
  );
};

export default Dashboard;
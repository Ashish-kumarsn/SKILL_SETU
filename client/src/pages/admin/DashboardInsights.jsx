import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Star, ChevronDown } from "lucide-react";

const salesData = [
  { day: "Sun", value: 2200 },
  { day: "Mon", value: 3900 },
  { day: "Tue", value: 2900 },
  { day: "Wed", value: 4500 },
  { day: "Thu", value: 2100 },
  { day: "Fri", value: 2800 },
  { day: "Sat", value: 3700 },
];

const topCourses = [
  { name: "Figma: Basic to Advanced", rating: 5.0, enroll: 35346, revenue: 10432, icon: "🎨", color: "bg-red-500" },
  { name: "Design System", rating: 4.5, enroll: 35223, revenue: 9445, icon: "📋", color: "bg-yellow-500" },
  { name: "Prototype in Figma", rating: 3.5, enroll: 31045, revenue: 9105, icon: "🔧", color: "bg-blue-500" },
  { name: "Basic Html & CSS", rating: 3.0, enroll: 25389, revenue: 8430, icon: "💜", color: "bg-purple-500" },
  { name: "Framer Advanced", rating: 4.0, enroll: 21056, revenue: 7445, icon: "⚡", color: "bg-indigo-500" },
  { name: "SaaS Design Learning", rating: 4.0, enroll: 13945, revenue: 5785, icon: "🏢", color: "bg-amber-500" },
];

const DashboardInsights = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("Sales");
  const [timePeriod, setTimePeriod] = useState("Today");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return `${value}`;
  };

  const getTabMetrics = (tab) => {
    const metrics = {
      "Sales": { value: "4.5K", date: "Dec 30, 2024" },
      "Subscription": { value: "2.3K", date: "Dec 30, 2024" },
      "New Register": { value: "1.8K", date: "Dec 30, 2024" }
    };
    return metrics[tab];
  };



  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6">
      {/* === SALES CHART SECTION === */}
      <Card className="bg-gradient-to-br from-[#0f172a] to-[#1e1e2e] text-white shadow-lg rounded-2xl border-0">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-white">Statistics</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1 rounded-lg flex items-center gap-2"
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                >
                  {timePeriod} <ChevronDown size={16} />
                </Button>
                
                {showTimeDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {["Today", "Monthly", "Yearly"].map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setTimePeriod(period);
                          setShowTimeDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 mt-4 border-b border-gray-700 pb-2">
            {["Sales", "Subscription", "New Register"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === tab 
                    ? "text-blue-400 border-b-2 border-blue-400" 
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab}
                {activeTab === tab && tab === "Sales" && (
                  <div className="absolute -top-8 left-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Sales Metric */}
          <div className="mt-4">
            <div className="text-2xl font-bold text-white">{getTabMetrics(activeTab).value}</div>
            <div className="text-sm text-gray-400">{getTabMetrics(activeTab).date}</div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#9ca3af" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCurrency(v)}
              />
              <Tooltip
                formatter={(value) => [`${value}`, "Amount"]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: "#f1f5f9",
                }}
                cursor={false}
              />
              <Bar 
                dataKey="value" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* === TOP COURSES SECTION === */}
      <Card className="bg-gradient-to-br from-[#0f172a] to-[#1e1e2e] text-white shadow-lg rounded-2xl border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-white">Top Courses</CardTitle>
            <Button 
              size="sm" 
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1 rounded-lg"
            //   onClick={handleViewAllCourses}
            >
              View All
            </Button>
          </div>
          
          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-4 mt-6 pb-3 border-b border-gray-700">
            <div className="col-span-5 text-xs font-medium text-gray-400 uppercase tracking-wider">
              COURSES
            </div>
            <div className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              RATING
            </div>
            <div className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              TOTAL ENROLL
            </div>
            <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
              REVENUE
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {topCourses.map((course, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors">
                {/* Course Name with Icon */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className={`w-8 h-8 ${course.color} rounded-lg flex items-center justify-center text-white text-sm font-medium`}>
                    {course.icon}
                  </div>
                  <span className="font-medium text-white text-sm">{course.name}</span>
                </div>
                
                {/* Rating */}
                <div className="col-span-2 flex items-center gap-1">
                  <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                  <span className="text-white font-medium text-sm">{course.rating.toFixed(1)}</span>
                </div>
                
                {/* Total Enrollment */}
                <div className="col-span-2">
                  <span className="text-gray-300 text-sm">{course.enroll.toLocaleString()}</span>
                </div>
                
                {/* Revenue */}
                <div className="col-span-3 text-right">
                  <span className="text-white font-medium text-sm">
                    ${(course.revenue * 100).toLocaleString()}.00
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardInsights;
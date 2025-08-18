/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader/* , CardTitle */ } from "@/components/ui/card";
/* import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react"; */

// Sample data for the chart
const chartData = [
  { month: "Feb", activity: 110, displayActivity: 110, fullMonth: "February" },
  { month: "Mar", activity: 78, displayActivity: 78, fullMonth: "March" },
  { month: "Apr", activity: 72, displayActivity: 72, fullMonth: "April" },
  { month: "May", activity: 91, displayActivity: 91, fullMonth: "May" },
  { 
    month: "Jun", 
    activity: 4445489, 
    displayActivity: 120, // Max height for visual display
    fullMonth: "June", 
    isHighlighted: true 
  },
  { month: "Jul", activity: 82, displayActivity: 82, fullMonth: "July" },
  { month: "Aug", activity: 88, displayActivity: 88, fullMonth: "August" },
  { month: "Sep", activity: 75, displayActivity: 75, fullMonth: "September" },
  { month: "Oct", activity: 63, displayActivity: 63, fullMonth: "October" },
  { month: "Nov", activity: 45, displayActivity: 45, fullMonth: "November" },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="border border-gray-200 rounded-lg p-3 space-y-1 shadow-lg bg-white z-50 max-w-[200px]">
        <p className="text-gray-700 font-medium">{`${label} 2025`}</p>
        <p className="text-gray-700">
          {data.activity.toLocaleString()} {/* Show actual value with commas */}
        </p>
        {data.isHighlighted && (
          <p className="text-gray-700 font-medium">
            Total Growth <span className="ml-6">+67%</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function CasesReportChart() {

  // const [timeFilter] = useState("Monthly");

  return (
    <Card className="w-full bg-[#FFF] flex flex-col justify-end item-end rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
     {/*    <CardTitle className="text-xl md:text-2xl font-semibold">
          Activity Team
        </CardTitle>
        <div className="hidden md:flex items-center gap-6">
         <div className="flex justify-center items-center gap-2">
          <p className="bg-[#12AEC5] h-4 w-4 rounded"></p>
          <h1>Revenue</h1>
         </div>
          <Button
            variant="outline"
            size="default"
            className="text-base font-medium text-[#4A4A4A] bg-white rounded-xl hover:bg-gray-50 border-gray-200 py-3"
          >
            {timeFilter}
            <ChevronDown className="ml-1 h-4 w-3" />
          </Button>
        </div> */}
      </CardHeader>

      <CardContent>
        <div className="w-full lg:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 20, bottom: 20 }}
              barCategoryGap="28%"
            >
              <CartesianGrid
                strokeDasharray="10 10"
                stroke="rgba(129, 127, 155, 0.3)"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 16, fill: "#000000" }}
              />
              <YAxis
                domain={[0, 120]}
                ticks={[0, 30, 60, 90, 120]}
                interval={0}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 16, fill: "#000000" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(8, 145, 178, 0.1)" }}
                wrapperStyle={{ outline: "none" }}
              />
              <Bar dataKey="displayActivity" radius={[8, 8, 8, 8]} maxBarSize={60}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isHighlighted ? "#0891B2" : "#C4EFF8"}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
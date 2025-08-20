/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, MoveUp } from "lucide-react";
import { useGetNewUserQuery } from "@/redux/api/adminApi";
import { Loading } from "../ui/loading";

interface TabConfig {
  label: string;
  value: string;
}

const TAB_CONFIGS: TabConfig[] = [
  { label: "Daily", value: "today" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const VISIBLE_USERS_LIMIT = 6;

export default function DashboardNewUsers() {
  const [activeTab, setActiveTab] = useState("today");
  const [expanded, setExpanded] = useState(false);

  const { data: allStatsData, isLoading } = useGetNewUserQuery({
    filter: activeTab,
  });

  const users = allStatsData?.result?.users || [];
  const userCount = allStatsData?.result?.count || 0;
  const hiddenUsersCount = expanded 
    ? 0 
    : Math.max(users.length - VISIBLE_USERS_LIMIT, 0);

  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[70vh] bg-white">
          <div className="flex items-center justify-center space-x-2">
            <Loading></Loading>
          </div>
        </div>
      );
    }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col shadow-xs h-full">
      {/* Header Section */}
      <div className="mb-6">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-0 mb-4 gap-3 sm:gap-0">
          <CardTitle className="text-sm font-medium text-gray-500">
            New Users
          </CardTitle>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-50 p-1 rounded-lg w-full sm:w-auto">
            {TAB_CONFIGS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>

        {/* Stats Display */}
        <CardContent className="p-0">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {userCount.toLocaleString()}
              </div>
              <div className="flex items-center mt-2">
                <Badge className="text-xs bg-white text-gray-800 border border-gray-200 rounded-full py-1 px-2 font-medium">
                  <MoveUp className="h-3 w-3 sm:h-4 sm:w-4 text-[#54BB52] mr-1" />
                  10% increase
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Users Section */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="py-2">
          <h2 className="text-sm font-medium text-gray-900">Join Today</h2>
        </div>
        
        {users.length > 0 ? (
          <div className="space-y-4">
            {/* Avatar Stack */}
            <div className="flex items-center -space-x-2 sm:-space-x-3 flex-wrap">
              {(expanded ? users : users.slice(0, VISIBLE_USERS_LIMIT)).map((user: any, index: number) => (
                <div key={user.id} className="relative group">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 sm:border-4 border-white hover:z-10 transition-all hover:scale-110 cursor-pointer">
                    <AvatarImage
                      src={`${user?.profileImage?.split("?")[0]}?w=128&h=128&fit=crop&crop=faces&auto=format&q=80`}
                      alt={user.name || `User ${index + 1}`}
                      className="object-cover"
                    />
                  </Avatar>
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                    {user.name || `User ${index + 1}`}
                  </div>
                </div>
              ))}
              
              {/* Hidden users counter */}
              {hiddenUsersCount > 0 && (
                <div className="relative">
                  <div className="bg-[#54BB52] text-white rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center text-xs sm:text-sm font-medium border-2 sm:border-4 border-white">
                    +{hiddenUsersCount}
                  </div>
                </div>
              )}
            </div>

            {/* Show more/less button */}
            {users.length > VISIBLE_USERS_LIMIT && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {expanded ? "Show less" : `Show ${hiddenUsersCount} more`}
                <ChevronDown
                  className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No new users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
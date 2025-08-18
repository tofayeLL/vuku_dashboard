"use client";

import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, MoveUp } from "lucide-react";

export default function DashboardNewUsers() {
  const [activeTab, setActiveTab] = useState("Daily");
  const [expanded, setExpanded] = useState(false);

  const tabs = ["Daily", "Weekly", "Monthly"];
  const users = [
    {
      id: 1,
      name: "John Doe",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format",
      joined: "2 hours ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face&auto=format",
      joined: "1 hour ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format",
      joined: "45 minutes ago",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format",
      joined: "30 minutes ago",
    },
    {
      id: 5,
      name: "David Brown",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&auto=format",
      joined: "25 minutes ago",
    },
    {
      id: 6,
      name: "Lisa Davis",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&auto=format",
      joined: "15 minutes ago",
    },
    {
      id: 7,
      name: "Tom Miller",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face&auto=format",
      joined: "10 minutes ago",
    },
    {
      id: 8,
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face&auto=format",
      joined: "Just now",
    },
  ];

  const visibleUsers = expanded ? users : users.slice(0, 5);
  const hiddenUsersCount = expanded ? 0 : Math.max(users.length - 5, 0);

  return (
    <div className="bg-white p-6 rounded-2xl flex flex-col shadow-xs ">
      {/* New Users Today Card */}
      <div className="mb-6 ">
        <CardHeader className="flex flex-row justify-between items-center p-0 mb-4">
          <CardTitle className="text-sm font-medium text-gray-500">
            New Users Today
          </CardTitle>
          <div className="flex space-x-1  p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-medium bg-white rounded-md transition-colors ${
                  activeTab === tab
                    ? " " /* "bg-white text-gray-900 shadow-sm" */
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">150</div>
              <div className="flex items-center mt-1">
                <Badge className="text-xs bg-white text-gray-800 border border-gray-200 rounded-full py-1 font-medium">
                  <MoveUp className="h-5 w-5 text-[#54BB52] " />
                  10% today
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Join Today Card */}
      <div className="mt-44">
        {" "}
        {/* Changed from mt-50 (invalid value) to mt-12 */}
        <div className="pb-3">
          <h1 className="text-sm font-medium text-gray-900">Join Today</h1>
        </div>
        <div className="space-y-4">
          <div className="flex items-center -space-x-4">
            {" "}
            {/* Increased negative space */}
            {visibleUsers.map((user) => (
              <div key={user.id} className="relative">
                <Avatar className="h-16 w-16 border-4 border-white hover:z-10 transition-all hover:scale-110">
                  <AvatarImage
                    src={`${
                      user.avatar.split("?")[0]
                    }?w=128&h=128&fit=crop&crop=faces&auto=format&q=80`}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-sm font-medium bg-gray-100">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {user.name}
                </span>
              </div>
            ))}
            {hiddenUsersCount > 0 && (
              <div className="relative">
                <span className="bg-[#54BB52] text-white rounded-full h-16 w-16 flex items-center justify-center text-sm font-medium border-4 border-white">
                  +{hiddenUsersCount}
                </span>
              </div>
            )}
          </div>
          {users.length > 5 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-xs text-gray-500 hover:text-gray-700"
            >
              {expanded ? "Show less" : "Show more"}
              <ChevronDown
                className={`h-4 w-4 ml-1 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
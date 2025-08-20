"use client";

import React from "react";
import { Loading } from "../ui/loading";
import Image from "next/image";
import icon from "@/assets/icon.png";
import icon2 from "@/assets/icons/DashboardHome/totalActive.png";
import icon3 from "@/assets/icons/DashboardHome/totalEarnings.png";
// import icon from "@/assets/icon.png";
import { useGetAllAdminStatsQuery } from "@/redux/api/adminApi";

const DashboardStat = () => {
  const { data: allStatsData, isLoading } = useGetAllAdminStatsQuery({});

  console.log("admin overview", allStatsData);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card 1 */}
      <div className="bg-white rounded-xl shadow py-16 flex px-10 justify-between">
        <div className="  ">
          <h1 className="font-medium text-lg text-gray-600">Total Users</h1>
          <p className="text-3xl font-bold text-gray-900 mt-3">
            {allStatsData?.result?.totalUsers}
          </p>
        </div>

        {/* card right */}
        <div className="p-2.5 rounded-full  flex items-center justify-center shrink-0">
          <Image
            src={icon}
            alt="Clock icon"
            width={56}
            height={56}
            unoptimized
            className="object-cover object-center"
          />
        </div>
      </div>
      {/* Card 2 */}
      <div className="bg-white rounded-xl shadow py-16 flex px-10 justify-between">
        <div className="  ">
          <h1 className="font-medium text-lg text-gray-600">Total Active</h1>
          <p className="text-3xl font-bold text-gray-900 mt-3">
            {allStatsData?.result?.activeUsers}
          </p>
        </div>

        {/* card right */}
        <div className="p-2.5 rounded-full  flex items-center justify-center shrink-0">
          <Image
            src={icon2}
            alt="Clock icon"
            width={56}
            height={56}
            unoptimized
            className="object-cover object-center"
          />
        </div>
      </div>
    
      {/* Card 4 */}
      <div className="bg-white rounded-xl shadow py-16 flex px-10 justify-between">
        <div className="  ">
          <h1 className="font-medium text-lg text-gray-600">Total Earnings</h1>
          <p className="text-3xl font-bold text-gray-900 mt-3">
            {allStatsData?.result?.totalEarnings}
          </p>
        </div>

        {/* card right */}
        <div className="p-2.5 rounded-full  flex items-center justify-center shrink-0">
          <Image
            src={icon3}
            alt="Clock icon"
            width={56}
            height={56}
            unoptimized
            className="object-cover object-center"
          />
        </div>
      </div>

     
    </div>
  );
};

export default DashboardStat;

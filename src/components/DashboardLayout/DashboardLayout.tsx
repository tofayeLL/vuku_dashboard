"use client";

import React from "react";
import DashboardStat from "./DashboardStat";

import ActivityTeamChart from "./CasesReportChart";
import OtherDashboardStat from "./OtherDashboardStat";
import RecentActivityTable from "./RecentActivityTable";

const DashboardLayout = () => {
  return (
    <section className="space-y-8">

      <DashboardStat />
      
      <div>
        <div className="flex w-[100%] justify-center items-center gap-6">
          <div className="w-[70%]">
            <ActivityTeamChart />
          </div>
          <div className="w-[30%] ">
            <OtherDashboardStat></OtherDashboardStat>
          </div>
        </div>    
      </div>

      <RecentActivityTable></RecentActivityTable>
    </section>
  );
};

export default DashboardLayout;

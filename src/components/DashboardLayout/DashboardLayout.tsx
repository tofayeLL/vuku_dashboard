"use client";

import React from "react";
import DashboardStat from "./DashboardStat";

import PaymentReportChart from "./PaymentReportChart";
import DashboardNewUsers from "./DashboardNewUsers";
import TotalUserTable from "./TotalUserTable";
import { BookList } from "./BookList";

const DashboardLayout = () => {
  return (
      <section className="space-y-8">

      <DashboardStat />
      
      <div>
        <div className="  grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <PaymentReportChart></PaymentReportChart>
          </div>
          <div className="col-span-1">
            <DashboardNewUsers></DashboardNewUsers>
          </div>
        </div>    
      </div>



      <div>
        <div className="  grid grid-cols-3 gap-6">
          <div className="col-span-2">
           <TotalUserTable></TotalUserTable>
          </div>
          <div className="col-span-1">
            <BookList></BookList>
          </div>
        </div>    
      </div>

    
    </section>
  );
};

export default DashboardLayout;

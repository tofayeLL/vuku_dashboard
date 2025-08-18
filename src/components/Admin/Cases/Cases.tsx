/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
// import { useState } from "react";
// import eye from "@/assets/eyeIcon.png";
// import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
/* import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"; */

// import Image from "next/image";
// import { Filter, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGetAllCasesQuery } from "@/redux/api/adminApi";
import { Loading } from "@/components/ui/loading";
import { Search } from "lucide-react";

const Cases = () => {
  // const [selectedCategory, setSelectedCategory] = useState("all");
  const {data: allCasesData, isLoading} = useGetAllCasesQuery({})
  // console.log("............",allCasesData);

 /*  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Add filtering logic here based on your needs
  }; */

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
    <section>
      <div>
        {/* header title */}
       {/*  <div className=" rounded-2xl p-6 flex justify-between items-center mb-4">
          <h1 className="lg:text-3xl font-semibold">Cases Management</h1>
          <div>
            <Filter className="h-10 w-10 text-gray-500" />
          </div>
        </div> */}

        <div className="bg-white p-6 rounded-2xl">
          <div className="w-full space-y-4">
            {/* Header with filters */}
            <div className="flex items-center justify-between l">
              <div className="">
                <h1 className="text-xl font-semibold text-gray-900">Cases Management</h1>
              </div>
              <div className="flex lg:flex-row flex-col items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search"
                    className=" pr-4 py-2 lg:w-40 bg-white border-gray-200 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>

              {/*   <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="">
                    <Filter className="h-4 w-4" />
                    Filter
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Category</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="cases">Cases</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                  </SelectContent>
                </Select>

                
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 py-2 text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  Refresh
                  <RefreshCw className="h-4 w-4" />
                </Button> */}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white overflow-hidden">
              <Table className="">
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow className="border-b">
                    <TableHead className=" text-base font-semibold ">
                     ReportId
                    </TableHead>
                    <TableHead className=" text-base font-semibold">
                     ApplierName
                    </TableHead>

                    <TableHead className=" text-base font-semibold">
                    Email
                    </TableHead>
                    <TableHead className=" text-base font-semibold">
                      VictimName
                    </TableHead>

                    <TableHead className=" text-base font-semibold">
                      Age
                    </TableHead>
                    <TableHead className=" text-base font-semibold">
                      Case
                    </TableHead>

                    <TableHead className=" text-base font-semibold">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    allCasesData?.result?.map((item: any)=>(
                      <TableRow key={item.id} className="border-b last:border-b-0 ">
                    <TableCell className="font-medium text-gray-700 ">
                     {item?.reportId}
                    </TableCell>
                    <TableCell className="text-gray-700 py-3">
                      {item?.applierName}
                    </TableCell>
                    <TableCell className="text-gray-700 py-3">
                     {/*  2025-04-28 <br />
                      10:00 AM */}
                      {item?.email}
                    </TableCell>
                    <TableCell className="text-gray-700 py-3">
                      {/* 2025-04-28 <br />
                      10:00 AM */}
                      {item?.victimName}
                    </TableCell>
                     <TableCell className="text-gray-700 py-3">
                      {item?.age}
                    </TableCell>

                  

                    {/*  <TableCell className="text-gray-700 py-3">
                                         <Badge
                                           variant="secondary"
                                           className={`px-5 py-1 text-base ${
                                             status === "Active"
                                               ? "bg-[#EEF9E8] text-[#53C31B]"
                                               : "bg-[#FE4D4F] text-[#53C31B]"
                                           }`}
                                         >
                                           {status}
                                         </Badge>
                                       </TableCell> */}

                    <TableCell className="text-gray-700 py-3">
                      {item?.case}
                    </TableCell>

                     <TableCell className="text-gray-700 py-3">
                      <Badge
                        variant="secondary"
                        className="bg-[#2196F31A] text-[#2196F3] px-5 py-1 text-base rounded-sm"
                      >
                       {item?.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                    ))

                  }
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cases;

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

import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { useGetAllRespondersQuery } from "@/redux/api/adminApi";
import { Loading } from "@/components/ui/loading";
import userImage from "@/assets/User.png";

const RespondersManagement = () => {
  // const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: allRespondersData, isLoading } = useGetAllRespondersQuery({});
  // console.log("......", allRespondersData);

  /*   const handleCategoryChange = (value: string) => {
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
          <h1 className="lg:text-3xl font-semibold"> Responders Management</h1>
          <div>
            <Filter className="h-10 w-10 text-gray-500" />
          </div>
        </div> */}

        <div className="bg-white p-6 rounded-2xl">
          <div className="w-full space-y-4">
            {/* Header with filters */}
            <div className="flex items-center justify-between l">
              <div className="">
                <h1 className="text-xl font-semibold text-gray-900">
                  Responders Management
                </h1>
              </div>
              <div className="flex lg:flex-row flex-col  items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search"
                    className=" pr-4 py-2 lg:w-40 bg-white border-gray-200 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>

                {/*  <Select
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
                    <TableHead className=" text-base text-gray-700 font-semibold">
                      User Name
                    </TableHead>
                    <TableHead className=" text-base text-gray-700 font-semibold">
                      Email
                    </TableHead>

                    <TableHead className=" text-base text-gray-700 font-semibold">
                      Role
                    </TableHead>
                    <TableHead className=" text-base text-gray-700 font-semibold">
                      Address
                    </TableHead>
                    <TableHead className=" text-base text-gray-700 font-semibold">
                     shelterName
                    </TableHead>
                   {/*  <TableHead className=" text-base text-gray-700 font-semibold">
                      Status
                    </TableHead> */}

                   {/*  <TableHead className=" text-base text-gray-700 font-semibold">
                      Assigned Cases
                    </TableHead> */}

                 {/*    <TableHead className=" text-base text-gray-700 font-semibold">
                      Action
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRespondersData?.result?.map((item: any) => (
                    <TableRow
                      key={item?.id}
                      className="border-b last:border-b-0"
                    >
                      <TableCell className="font-medium text-gray-700 py-3 flex justify-start items-center gap-2">
                        <span>
                          <Image
                            src={item?.profileImage|| userImage}
                            alt="image"
                            width={40}
                            height={40}
                            className="rounded-sm object-cover w-10 h-10"
                          />{" "}
                        </span>
                        {item?.userName || "not found"}
                      </TableCell>
                      <TableCell className="text-gray-700 py-3">
                        {item?.email}
                      </TableCell>
                      <TableCell className="text-gray-700 py-3">
                          {item?.role}
                      </TableCell>
                      <TableCell className="text-gray-700 py-3">
                          {item?.address || "not found"}
                      </TableCell>
                      <TableCell className="text-gray-700 py-3">
                          {item?.shelterName || "not found"}
                      </TableCell>

                    {/*   <TableCell className="text-gray-700 py-3">
                        <Badge
                          variant="secondary"
                          className="bg-[#EEF9E8] text-[#53C31B] px-5 py-1 text-base"
                        >
                          Action
                        </Badge>
                      </TableCell> */}
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

                     {/*  <TableCell className="text-gray-700 py-3">12</TableCell> */}

                     {/*  <TableCell className="py-3">
                        <div className="flex gap-4">
                          <button className="w-10 h-10 flex items-center justify-center rounded-lg">
                            <div className="relative">
                              <Image
                                src={eye}
                                alt="eye"
                                height={50}
                                width={50}
                                className="object-cover w-6 h-6 object-center"
                                priority
                              />
                            </div>
                          </button>
                        </div>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RespondersManagement;

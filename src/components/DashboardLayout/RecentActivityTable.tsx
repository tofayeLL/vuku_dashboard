"use client";
import React from "react";

import { useState } from "react";
import eye from "@/assets/eyeIcon.png";
import deleteIcon from "@/assets/icons/Warden Management/Delete.png";
import edit from "@/assets/icons/Warden Management/Edit Square.png";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ActivityData {
  id: string;
  date: string;
  user: string;
  details: string;
  status: {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color: string;
  };
}

const mockData: ActivityData[] = [
  {
    id: "1",
    date: "2024-01-11",
    user: "Jessica Wilson",
    details: "Training: First Aid",
    status: {
      label: "Training Completed",
      variant: "default",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
  },
  {
    id: "2",
    date: "2024-01-14",
    user: "David Lee",
    details: "Case ID: 56548544",
    status: {
      label: "Case Escalated",
      variant: "secondary",
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
  },
  {
    id: "3",
    date: "2024-01-15",
    user: "Sarah Miller",
    details: "Report ID: 12344755",
    status: {
      label: "Report Submitted",
      variant: "destructive",
      color: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  },
];

const RecentActivityTable = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("august-2024");

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Add filtering logic here based on your needs
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    // Add filtering logic here based on your needs
  };

  return (
    <section>
      <div className="bg-white p-6 rounded-2xl">
        <div className="w-full space-y-4">
          {/* Header with filters */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
            <div className="flex items-center gap-4">
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="All Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Category</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="cases">Cases</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="">
                  <SelectValue placeholder="August 2024" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="august-2024">August 2024</SelectItem>
                  <SelectItem value="july-2024">July 2024</SelectItem>
                  <SelectItem value="june-2024">June 2024</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-transparent text-black hover:bg-transparent border border-gray">
                See More
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-white overflow-hidden">
            <Table className="">
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="border-b">
                  <TableHead className=" text-base font-semibold">Date</TableHead>
                  <TableHead className=" text-base font-semibold">User</TableHead>
                  <TableHead className=" text-base font-semibold">
                    Details
                  </TableHead>
                  <TableHead className=" text-base font-semibold">
                    Status
                  </TableHead>
                  <TableHead className=" text-base font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item) => (
                  <TableRow key={item.id} className="border-b last:border-b-0">
                    <TableCell className="font-medium text-gray-900 py-3">
                      {item.date}
                    </TableCell>
                    <TableCell className="text-gray-700 py-3">
                      {item.user}
                    </TableCell>
                    <TableCell className="text-gray-700 py-3">
                      {item.details}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className={`${item.status.color} border-0 font-medium py-2 w-[65%] `}
                      >
                        {item.status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
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

                        {/* edit button */}
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg">
                          <div className="relative">
                            <Image
                              src={edit}
                              alt="edit"
                              height={50}
                              width={50}
                              className="object-cover w-6 h-6 object-center"
                              priority
                            />
                          </div>
                        </button>

                        {/* delete button */}
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg">
                          <div className="relative">
                            <Image
                              src={deleteIcon}
                              alt="delete"
                              height={50}
                              width={50}
                              className="object-cover w-6 h-6 object-center"
                              priority
                            />
                          </div>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentActivityTable;

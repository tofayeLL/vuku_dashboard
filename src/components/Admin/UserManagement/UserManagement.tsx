"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Filter, Search } from "lucide-react";

import Image from "next/image";
import userImage from "@/assets/User.png";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

/* interface ActivityData {
  id: string;
  date: string;
  user: string;
  details: string;
  status: {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color: string;
  };
} */

const UserManagementAdmin = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Add filtering logic here based on your needs
  };

  return (
    <section>
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="w-full space-y-4">
          {/* Header with filters */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              User Management
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search"
                  className=" pr-4 py-2 lg:w-40 bg-white border-gray-200 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              <Select
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
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-white overflow-hidden ">
            <Table className="">
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="border-b">
                  
                  <TableHead className=" text-base font-semibold">
                    Name
                  </TableHead>
                  <TableHead className=" text-base font-semibold">
                    Category
                  </TableHead>
                  <TableHead className=" text-base font-semibold">
                   Email
                  </TableHead>
                  <TableHead className=" text-base font-semibold">
                    Continue Reading
                  </TableHead>
                
                  <TableHead className=" text-base font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b last:border-b-0">
                  
                  <TableCell className="font-medium text-gray-700 py-3 flex justify-start items-center gap-2">
                    <span>
                      <Image
                        src={userImage}
                        alt="image"
                        width={40}
                        height={40}
                        className="rounded-sm object-cover w-10 h-10"
                      />
                    </span>{" "}
                    Mia Johnson
                  </TableCell>
                  <TableCell className="text-gray-700 py-3">
                    Beginner
                  </TableCell>
                  <TableCell className="py-3">shamim03@gmail.com</TableCell>
                  <TableCell className="py-3">25%</TableCell>
                 
                   
                   <TableCell className="text-gray-700 py-3 space-x-3 ">
                    <Button
                    
                      variant="outline"
                      className=" bg-yellow-50 w-[40%] text-[#FAAD14]  hover:bg-[#fcab091a] hover:text-[#dd9505]  px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer"
                    >
                      View User
                    </Button>


                    <Button
                      variant="outline"
                      className="bg-red-50 w-[40%] text-red-600  hover:bg-red-100 hover:text-red-700  px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer"
                    >
                      Delete User
                    </Button>
                  </TableCell>
                   
                   
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserManagementAdmin;
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {  Search } from "lucide-react";

import Image from "next/image";
import { Input } from "@/components/ui/input";


import { Button } from "@/components/ui/button";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import Pagination from "@/components/ui/pagination";
import { Loading } from "@/components/ui/loading";

const UserManagementAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const limit = 8;
  // const [selectedCategory, setSelectedCategory] = useState("all");

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to first page when searching
      if (searchTerm !== debouncedSearchTerm) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  const { data: getAllUser, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: limit,
    search: debouncedSearchTerm,
  });

  console.log("userManagement", getAllUser);
  console.log("userManagement2", getAllUser?.result?.users);

/*   const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Add filtering logic here based on your needs
  }; */

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

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
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pr-10 py-2 lg:w-64 bg-white border-gray-200 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 h-4 w-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
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
              </Select> */}
            </div>
          </div>

          {/* Search Results Info */}
          {debouncedSearchTerm && (
            <div className="text-sm text-gray-600">
              {getAllUser?.result?.users?.length > 0 
                ? `Found ${getAllUser?.result?.totalUsers || getAllUser?.result?.users?.length} result(s) for "${debouncedSearchTerm}"`
                : `No results found for "${debouncedSearchTerm}"`
              }
            </div>
          )}

          {/* Table */}
          <div className="rounded-lg border bg-white overflow-hidden">
            <Table className="">
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="border-b">
                  <TableHead className="text-base font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-base font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="text-base font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-base font-semibold">
                    Continue Reading
                  </TableHead>
                  <TableHead className="text-base font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAllUser?.result?.users?.length > 0 ? (
                  getAllUser.result.users.map((item: any) => (
                    <TableRow key={item?.id} className="border-b last:border-b-0">
                      <TableCell className="font-medium text-gray-700 py-3 flex justify-start items-center gap-2">
                        <span>
                          <Image
                            src={item?.profileImage || "/placeholder-user.png"}
                            alt="User profile"
                            width={40}
                            height={40}
                            className="rounded-sm object-cover w-10 h-10"
                          />
                        </span>
                        {item?.fullName || "Not found"}
                      </TableCell>
                      <TableCell className="text-gray-700 py-3">
                        {item?.readLevel || "Not found"}
                      </TableCell>
                      <TableCell className="py-3">
                        {item?.email || "Not found"}
                      </TableCell>
                      <TableCell className="py-3">
                        {item?.points || "Not found"}
                      </TableCell>
                      <TableCell className="text-gray-700 py-3 space-x-3">
                        <Button
                          variant="outline"
                          className="bg-yellow-50 w-[40%] text-[#FAAD14] hover:bg-[#fcab091a] hover:text-[#dd9505] px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer"
                        >
                          View User
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-red-50 w-[40%] text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer"
                        >
                          Delete User
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {debouncedSearchTerm ? "No users found matching your search." : "No users found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      {getAllUser?.result?.users?.length > 0 && (
        <div className="flex justify-end items-center mt-14">
          <Pagination
            totalPage={getAllUser?.result?.totalPages || 1}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
    </section>
  );
};

export default UserManagementAdmin;
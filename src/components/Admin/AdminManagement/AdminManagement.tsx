/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

import { useState } from "react";
/* import eye from "@/assets/eyeIcon.png";
import deleteIcon from "@/assets/icons/Warden Management/Delete.png";
import edit from "@/assets/icons/Warden Management/Edit Square.png"; */
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* import Image from "next/image"; */
import { Search } from "lucide-react";
import { Input } from "../../ui/input";
import AdminModal from "./AdminModal";
import { AiOutlinePlus } from "react-icons/ai";
import { useGetAllAdminsQuery } from "@/redux/api/adminApi";
import { Loading } from "@/components/ui/loading";
import Image from "next/image";
import userImage from "@/assets/User.png";

const AdminManagement = () => {
  // const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allAdmins, isLoading } = useGetAllAdminsQuery({});
  console.log("....", allAdmins?.result);

  /* only name search functionality
  const filteredAdmins = allAdmins?.result?.filter((admin: any) =>
  admin.adminName.toLowerCase().includes(searchTerm.toLowerCase())
);
 */

  const filteredAdmins = allAdmins?.result?.filter(
    (admin: any) =>
      admin?.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin?.phone?.includes(searchTerm)
  );

  const handleSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
    // Handle your form submission logic here
    // setIsModalOpen(false) // Close modal after submit
  };

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
        <div className="bg-white rounded-2xl p-6 flex justify-between items-center mb-6">
          <h1>Admin Management</h1>
          <div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="text-[#12AEC5] border border-[#12AEC5] bg-transparent hover:bg-transparent  hover:text-[#12AEC5] cursor-pointer"
            >
              <span>
                <AiOutlinePlus />
              </span>{" "}
              Add Admin
            </Button>
            <AdminModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <div className="w-full space-y-4">
            {/* Header with filters */}
            <div className="flex items-center justify-between l">
              <div className="">
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Management
                </h1>
              </div>
              <div className="flex lg:flex-row flex-col  items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>

                {/*    <Select
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

                {/* Refresh Button */}
                {/*  <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 py-2 text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  Refresh
                  <RefreshCw className="h-4 w-4" />
                </Button> */}
              </div>
            </div>

            <div className="rounded-lg border bg-white overflow-hidden">
              <Table className="">
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow className="border-b">
                    <TableHead className=" text-base font-semibold">
                      Name
                    </TableHead>
                    <TableHead className=" text-base font-semibold">
                      User Id
                    </TableHead>
                    <TableHead className=" text-base font-semibold">
                      Email
                    </TableHead>
                    <TableHead className=" text-base font-semibold">
                      Phone
                    </TableHead>

                    {/*   <TableHead className=" text-base font-semibold">
                      Action
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins?.length > 0 ? (
                    filteredAdmins.map((item: any) => (
                      <TableRow
                        key={item.id}
                        className="border-b last:border-b-0"
                      >
                        <TableCell className="font-medium text-gray-700 py-3 flex justify-start items-center gap-2">
                          <span>
                            <Image
                              src={item?.profileImage || userImage}
                              alt="image"
                              width={40}
                              height={40}
                              className="rounded-sm object-cover w-10 h-10"
                            />
                          </span>
                          {item?.adminName}
                        </TableCell>
                        <TableCell className="text-gray-700 py-3">
                          {item?.id}
                        </TableCell>
                        <TableCell className="text-gray-700 py-3">
                          {item?.email}
                        </TableCell>
                        <TableCell className="text-gray-700 py-3">
                          {item?.phone}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        {searchTerm
                          ? "No matching admins found"
                          : "No admins available"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminManagement;

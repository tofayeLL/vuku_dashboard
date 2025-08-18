/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@/components/ui/select";

import Image from "next/image";
import { Filter, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AiOutlinePlus } from "react-icons/ai";
import { Progress } from "@/components/ui/progress";
import { TrainingModal } from "./TrainingModal";

const Training = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
    // Handle your form submission logic here
    // setIsModalOpen(false) // Close modal after submit
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Add filtering logic here based on your needs
  };

  return (
    <section>
      <div>
        {/* header title */}
        <div className=" rounded-2xl p-6 flex lg:flex-row flex-col  justify-between items-center mb-4">
          <h1 className="lg:text-3xl font-semibold">Training</h1>
          <div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="text-white text-base border bg-[#12AEC5] border-[#12AEC5] hover:text-white hover:bg-[#12AEC5] cursor-pointer"
            >
              <span>
                <AiOutlinePlus />
              </span>{" "}
              Training management
            </Button>

            <TrainingModal
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
                <h1 className="text-xl font-semibold text-gray-900">Cases</h1>
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

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 py-2 text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  Refresh
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white overflow-hidden">
              <Table className="">
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow className="border-b">
                    <TableHead className=" text-base font-semibold ">
                      Name
                    </TableHead>
                    <TableHead className=" text-base font-semibold">
                      Description
                    </TableHead>

                    <TableHead className=" text-base font-semibold">
                      Category
                    </TableHead>
                    <TableHead className=" text-base font-semibold">
                      Status
                    </TableHead>

                    <TableHead className=" text-base font-semibold">
                      Completion
                    </TableHead>

                    <TableHead className=" text-base font-semibold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b last:border-b-0 ">
                    <TableCell className="font-medium text-gray-700 ">
                      Emergency Response Training
                    </TableCell>
                    <TableCell className="text-gray-700 py-3">
                      Comprehensive training on handling emergencies.
                    </TableCell>
                    <TableCell className="py-3 ">
                      <Badge
                        variant="secondary"
                        className=" px-5 py-1 text-base rounded-sm bg-[#2196F31A] text-[#2196F3]"
                      >
                        Compliance
                      </Badge>
                    </TableCell>

                    <TableCell className="text-gray-700 py-3">
                      <Badge
                        variant="secondary"
                        className=" px-5 py-1 text-base rounded-sm text-[#FAAD14] bg-[#FFF7E8]"
                      >
                        Draft
                      </Badge>
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
                      <div className="flex justify-center items-center gap-3">
                        <Progress value={75} className="w-[100%]" />
                        <span>75</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="flex gap-2">
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
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Training;

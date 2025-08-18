"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import { PiCheckFat } from "react-icons/pi";

import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import UserListTable from "./UserListTable";
import AddPlanModal from "./AddPlanModal";

const SubscriptionPlan = () => {
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  return (
    <section>
      {/* header */}

      <div className="bg-white  text-xl font-semibold p-6 flex justify-between items-center mb-6">
        <h1>Subscription plan</h1>
        <div>
          <Button
            className="text-gray-600 border text-lg bg-transparent font-semibold  hover:bg-transparent   cursor-pointer "
            onClick={() => setIsAddPlanModalOpen(true)}
          >
            <span>
              <AiOutlinePlus />
            </span>{" "}
            Add Plan
          </Button>
          {/* Add Plan Modal */}
          <AddPlanModal
            isOpen={isAddPlanModalOpen}
            onClose={() => setIsAddPlanModalOpen(false)}
          />
        </div>
      </div>

      {/* subscription card */}

      <div className="my-10">
        <Card className=" max-w-sm border-2 border-green-500  relative rounded-4xl ">
          {/* Edit icon */}
          <div className="absolute top-4 right-4 mt-2">
            <Edit className="h-8 w-8 text-gray-400" />
          </div>

          <CardContent className="pb-6 px-0 relative">
            {/* Freemium badge */}
            <div className="mb-4 absolute top-[-40px]">
              <Badge
                variant="outline"
                className="border-2 border-green-500 text-gray-700 bg-white px-5 py-1 rounded-full"
              >
                Freemium
              </Badge>
            </div>

            {/* Price */}
            <div className="mb-4 mt-2">
              <span className="text-3xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600 font-bold text-xl">/mo</span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="text-base">
                <span className=" font-semibold text-gray-800">Duration:</span>
                <span className="text-gray-800  ml-2">Lifetime</span>
              </div>
              <div className="text-base">
                <span className="font-semibold text-gray-900">Ideal for:</span>
                <span className="text-gray-600 ml-2">First-time users</span>
              </div>
              <div className="text-base">
                <span className="font-semibold text-gray-900">
                  Book Access:
                </span>
                <span className="text-gray-600 ml-2">5-7 Books</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex items-start gap-2 mb-10">
              {/*  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> */}
              <PiCheckFat className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-base text-gray-500">
                Limited features, basic voice recognition, progress tracking
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* user list table */}
      <div>
        <UserListTable></UserListTable>
      </div>
    </section>
  );
};

export default SubscriptionPlan;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { MdEdit } from "react-icons/md";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/api/settingsApi";
import { toast } from "sonner";
import { ImageUploader } from "../ui/ImageUploader";
import userImage from "@/assets/images/userImage.jpg";
import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { Loading } from "../ui/loading";

interface ProfileData {
  fullName: string;
  email?: string;
}

const BasicSection = () => {
  const [active, setActive] = useState(false);
  const { data: userProfile, isLoading: isProfileImageLoading } = useGetSingleUserQuery({});

  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    email: "",
  });

  const { data, isLoading: isProfileLoading } = useGetMyProfileQuery("");
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();

  // Initialize form with fetched data
  useEffect(() => {
    if (data?.result) {
      setProfile({
        fullName: data.result.fullName || "",
        email: data.result.email || "",
      });
    }
  }, [data]);

  const handleProfileChange = (key: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      // Only send fullName to backend as per your requirement
      const updateData = {
        fullName: profile.fullName.trim()
      };

      // Validate fullName is not empty
      if (!updateData.fullName) {
        toast.error("Full name is required");
        return;
      }

      const result = await updateMyProfile(updateData).unwrap();
      console.log("update profile",result);
      
      toast.success("Profile updated successfully!");
      
      // Optional: You might want to refetch the profile data here
      // or the mutation might return updated data
      
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

   if (isLoading || isProfileLoading || isProfileImageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-white">
        <div className="flex items-center justify-center space-x-2">
          <Loading></Loading>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center gap-2 border-b border-[#F6F6F6] pb-6 mb-6">
        <h1 className="text-lg font-medium text-[#30373D]">
          Profile Information
        </h1>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Update your profile information</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Card className="p-0">
        <CardContent className="space-y-6">
          {/* Photo Profile */}
          <div className="flex items-center gap-10">
            <div>
              <Label className="text-sm font-medium text-[#30373D] mb-3 block">
                Photo Profile
              </Label>
              <div className="relative w-24 h-24">
                <Image
                  src={userProfile?.result?.profileImage || userImage}
                  height={150}
                  width={150}
                  alt="Profile"
                  className="rounded-md object-cover"
                  priority
                />
                <button
                  onClick={() => setActive(!active)}
                  className="absolute -bottom-0 -right-0 rounded-br-sm bg-white p-1.5 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <MdEdit className="h-4 w-4" />
                </button>
              </div>
            </div>
            {active && <ImageUploader />}
          </div>

          {/* Full Name */}
          <div>
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-[#30373D]"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={profile.fullName}
              placeholder="Enter your full name"
              onChange={(e) =>
                handleProfileChange("fullName", e.target.value)
              }
              className="mt-2 px-5 py-4"
              required
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-[#30373D]"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email || ""}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="mt-2 px-5 py-4"
              placeholder={data?.result?.email ?? "not found"}
              disabled
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address (e.g., user@example.com)"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isLoading || !profile.fullName.trim()}
        className="bg-[#54BB52] hover:bg-[#3a9938] text-white px-8 mt-6 py-3"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default BasicSection;
"use client";

import React, { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import Image from "next/image";
import { MdEdit } from "react-icons/md";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/api/settingsApi";
// import altImg from "@/assets/User.png";
import { toast } from "sonner";
import { ImageUploader } from "../ui/ImageUploader";
import userImage from "@/assets/images/userImage.jpg";
import { useSelector } from "react-redux";
import { useAuth } from "@/redux/features/authSlice";

interface ProfileData {
  displayName: string;
  country: string;
  city: string;
  province: string;
  phoneNumber: string;
  email?: string;
  bio: string;
  avatar: string;
}

const BasicSection = () => {
  const [active, setActive] = useState(false);
  const authState = useSelector(useAuth);
  console.log("to navbar", authState);
  console.log("to navbar", authState?.adminInfo?.profileImage);
  const [profile, setProfile] = useState<ProfileData>({
    displayName: "",
    country: "",
    city: "",
    province: "",
    phoneNumber: "",
    email: "",
    bio: "",
    avatar: "",
  });

  const { data, isLoading: isProfileLoading } = useGetMyProfileQuery("");
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();

  // Initialize form with fetched data
  useEffect(() => {
    if (data?.result) {
      setProfile({
        displayName: data.result.displayName || "",
        email: data.result.email || "",
        country: data.result.country || "",
        city: data.result.city || "",
        province: data.result.province || "",
        phoneNumber: data.result.phoneNumber || "",
        bio: data.result.bio || "",
        avatar: data.result.profileImage || "",
      });
    }
  }, [data]);

  const handleProfileChange = (key: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      // Console log ALL current form data before any processing
      console.log("Current form data before submission:", profile);

      // Create payload with only changed values
      const payload: Partial<ProfileData> = {};

      // Check each field for changes
      if (profile.displayName !== data?.result?.displayName) {
        payload.displayName = profile.displayName;
      }
      if (profile.email !== data?.result?.email) {
        payload.email = profile.email;
      }
      if (profile.country !== data?.result?.country) {
        payload.country = profile.country;
      }
      if (profile.city !== data?.result?.city) {
        payload.city = profile.city;
      }
      if (profile.province !== data?.result?.province) {
        payload.province = profile.province;
      }
      if (profile.bio !== data?.result?.bio) {
        payload.bio = profile.bio;
      }
      if (profile.phoneNumber !== data?.result?.phoneNumber) {
        payload.phoneNumber = profile.phoneNumber;
      }

      // Console log the changes that will be submitted
      console.log("Changes to be submitted:", payload);

      // Only submit if there are changes
      if (Object.keys(payload).length > 0) {
        const response = await updateMyProfile(payload).unwrap();
        if (response?.success) {
          toast.success(response?.message);
          console.log("Updated profile data:", payload);
        }
      } else {
        toast.info("No changes to save");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (isProfileLoading) return <div>Loading profile...</div>;

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
                  src={profile.avatar || userImage}
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

          {/* Display Name */}
          <div>
            <Label
              htmlFor="displayName"
              className="text-sm font-medium text-[#30373D]"
            >
              Display Name
            </Label>
            <Input
              id="displayName"
              type="text"
              value={profile.displayName}
              placeholder={authState?.adminInfo?.adminName ?? undefined}
              onChange={(e) =>
                handleProfileChange("displayName", e.target.value)
              }
              className="mt-2 px-5 py-4"
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
              placeholder={authState?.adminInfo?.email ?? "not found"}
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address (e.g., user@example.com)"
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label
              htmlFor="phoneNumber"
              className="text-sm font-medium text-[#30373D]"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={profile.phoneNumber}
              placeholder={authState?.adminInfo?.phone ?? "not found"}
              onChange={(e) =>
                handleProfileChange("phoneNumber", e.target.value)
              }
              className="mt-2 px-5 py-4"
            />
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label
                htmlFor="country"
                className="text-sm font-medium text-[#30373D]"
              >
                Country
              </Label>
              <Select
                value={profile.country}
                onValueChange={(value) => handleProfileChange("country", value)}
              >
                <SelectTrigger className="mt-2 px-5 py-4 w-full">
                  <SelectValue
                    placeholder={authState?.adminInfo?.country ?? "not found"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="Nepal">Nepal</SelectItem>
                  <SelectItem value="Vietnam">Vietnam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="city"
                className="text-sm font-medium text-[#30373D]"
              >
                City
              </Label>
              <Select
                value={profile.city}
                onValueChange={(value) => handleProfileChange("city", value)}
              >
                <SelectTrigger className="mt-2 px-5 py-4 w-full">
                  <SelectValue
                    placeholder={authState?.adminInfo?.city ?? "not found"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dhaka">Dhaka</SelectItem>
                  <SelectItem value="Kathmandu">Kathmandu</SelectItem>
                  <SelectItem value="Hanoi">Hanoi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="province"
                className="text-sm font-medium text-[#30373D]"
              >
                Province
              </Label>
              <Select
                value={profile.province}
                onValueChange={(value) =>
                  handleProfileChange("province", value)
                }
              >
                <SelectTrigger className="mt-2 px-5 py-4 w-full">
                  <SelectValue
                    placeholder={authState?.adminInfo?.province ?? "not found"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dhaka">Dhaka</SelectItem>
                  <SelectItem value="Province 1">Province 1</SelectItem>
                  <SelectItem value="Red River Delta">
                    Red River Delta
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio" className="text-sm font-medium text-[#30373D]">
              Bio
            </Label>
            <Input
              id="bio"
              type="text"
              value={profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              placeholder={authState?.adminInfo?.bio ?? "not found"}
              className="mt-2 px-5 py-4"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="bg-[#00A8CC] hover:bg-[#00A8CC80] text-white px-8 mt-6 py-3"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default BasicSection;

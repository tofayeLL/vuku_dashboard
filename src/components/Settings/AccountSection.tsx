"use client";

import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Eye, EyeIcon, EyeOff, EyeOffIcon, Info } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const AccountSection = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    console.log("Form data:", data);
    if (data?.oldPassword === data?.newPassword) {
      toast.error("New password must not be similar to the previous!");
    } else {
      try {
        const body = {
          currentPassword: data?.oldPassword,
          newPassword: data?.newPassword,
        };

        const response = await changePassword({ body });
        console.log("change password", response);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          
          // Reset form after successful password change
          reset();
          
          // Also reset password visibility states
          setShowOldPassword(false);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        } else if (response?.error) {
          if ("data" in response.error && response.error.data) {
            toast.error(
              (response.error.data as { message?: string })?.message ||
                "An unknown error occurred."
            );
          } else if ("message" in response.error) {
            toast.error(response.error.message);
          } else {
            toast.error("An unknown error occurred.");
          }
        }
      } catch (err) {
        console.error("Error resetting password:", err);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-[#F6F6F6] pb-6 mb-6">
        <h1 className="text-lg font-medium text-[#30373D]">Password</h1>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Update your account password</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Card className="p-0">
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Old Password */}
            <div>
              <Label
                htmlFor="old-password"
                className="text-sm font-medium text-[#30373D]"
              >
                Old Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="old-password"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Input your old password"
                  {...register("oldPassword")}
                  className="px-5 py-4"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="text-sm font-medium text-[#30373D]"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Input your new password"
                  {...register("newPassword")}
                  className={`${
                    errors?.newPassword ? "border-red-500" : ""
                  } px-5 py-4`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors?.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
              <p className="text-[#8C91A2] text-xs">
                Min 8 Characters with a combination of letters and numbers
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm font-medium text-[#30373D]"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="confirmation your new password"
                  {...register("confirmPassword")}
                  className={`${
                    errors?.confirmPassword ? "border-red-500" : ""
                  } px-5 py-4`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors?.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button className="bg-[#54BB52] hover:bg-[#2b992a] text-white px-8 mt-2 py-3">
              {isLoading ? "Saving" : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSection;
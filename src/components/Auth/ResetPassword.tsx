"use client";

import React, { useState } from 'react';
import { useResetPasswordMutation } from '@/redux/api/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const resetPasswordSchema = z
    .object({
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetPass, { isLoading }] = useResetPasswordMutation();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onSubmit",
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            const body = {
                newPassword: data?.newPassword,
            };
            const response = await resetPass(body);
            console.log(response);
            if (response?.data?.success) {
                toast.success(response?.data?.message);
                localStorage.removeItem("email");
                localStorage.removeItem("otp");
                router.push("/login");
            }
            else {
                if (typeof response?.error === 'object' && response?.error !== null) {
                    if ('data' in response?.error && response.error.data) {
                        toast.error((response.error.data as { message?: string })?.message || "An unknown error occurred.");
                    } else if ('message' in response?.error) {
                        toast.error(response.error.message);
                    } else {
                        toast.error("An unknown error occurred.");
                    }
                }
            }
        }
        catch (err) {
            console.log("Error:", err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-4">
            <div className="w-full max-w-[500px] space-y-6 rounded-2xl bg-[#F8F8F8] p-6">
                <div className="space-y-2 mt-6 mb-8 text-center">
                    <h1 className="text-xl md:text-4xl font-outfit font-semibold">
                        Reset Password!
                    </h1>
                    <p className="text-sm md:text-base font-normal font-inter text-slate-700">
                        Enter a different password than the previous one
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="new-password"
                            className="text-sm md:text-[18px] font-outfit text-gray-600"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                placeholder="********"
                                type={showPassword ? "text" : "password"}
                                {...register("newPassword")}
                                required
                                className={`w-full bg-white rounded-lg px-4 py-2 ${errors.newPassword ? "border-red-500" : "border-[#98A2B3]"
                                    } pr-10`}
                            />
                            <button
                                type="button"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-4 w-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors?.newPassword && (
                            <p className="text-red-500 text-sm">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="confirm-password"
                            className="text-sm md:text-[18px] font-outfit text-[#475467]"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                placeholder="********"
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                required
                                className={`w-full bg-white rounded-lg px-4 py-2 ${errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-[#98A2B3]"
                                    } pr-10`}
                            />
                            <button
                                type="button"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-4 w-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#00A8CC] hover:bg-[#00A8CC80] text-white font-bold rounded-lg mt-2 flex justify-center items-center font-outfit text-[18px] py-[10px] cursor-pointer transition-colors duration-300 ease-in-out"
                    >
                        {isLoading ? "Reseting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
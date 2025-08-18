"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/api/authApi";

const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Enter a valid email" }),
});

type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPassword() {
    const [forgotPas, { isLoading }] = useForgotPasswordMutation();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordData) => {
        try {
            const response = await forgotPas(data).unwrap();
            // console.log(response);
            if (response?.success) {
                localStorage.setItem("email", data?.email);
                localStorage.setItem("otp", response?.result);
                toast.success(response?.message + "!" + " Your OTP " + "(" + response?.result + ")")
            }
            reset();
            router.push("/otp");
        } catch (err) {
            // console.log("Error:", err);
            if (typeof err === 'object' && err !== null) {
                if ('data' in err && err.data) {
                    const message = (err.data as { message?: string })?.message || "An unknown error occurred.";
                    toast.error(message);
                } else if ('message' in err) {
                    toast.error((err as { message?: string }).message || "An unknown error occurred.");
                } else {
                    toast.error("An unknown error occurred.");
                }
            } else {
                toast.error("An unknown error occurred.");
            }
        }

    };

    return (
        <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen">
            <div className="w-full max-w-[454px] space-y-6">
                {/* Form */}
                <div className="bg-[#F8F8F8] rounded-2xl p-12">
                    <div className="text-center">
                        <h1 className="text-4xl text-[#1D2939] sm:text-3xl md:text-4xl font-sans font-bold">
                            Forgot Password!
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base mt-4 font-outfit text-gray-500">
                            Enter your registered email below.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="mt-7">
                            <label
                                htmlFor="email"
                                className="text-base sm:text-lg md:text-[18px] font-normal font-outfit text-[#475467]"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                placeholder="admin@gmail.com"
                                type="email"
                                className="w-full h-12 text-sm text-[#475467] border-[#98A2B3] pr-10 placeholder:text-[#98A2B3] placeholder:text-sm placeholder:font-normal bg-white rounded-lg outline-none px-4 py-1"
                                {...register("email")} // Register the input with validation
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors?.email?.message}*
                                </p>
                            )}
                        </div>

                        {/* Remember password link */}
                        <div className="flex items-center justify-start text-xs sm:text-sm">
                            <span className="text-gray-600">Remember the password?</span>
                            <Link
                                href="/login"
                                className="ml-1 underline text-[#00A8CC] font-medium font-inter hover:underline"
                            >
                                Login
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#00A8CC] hover:bg-[#00A8CC80] text-white font-bold rounded-lg mt-2 flex justify-center items-center font-outfit text-[18px] py-[10px] cursor-pointer transition-colors duration-300 ease-in-out"
                            disabled={isLoading} // Disable while loading
                        >
                            {isLoading ? (
                                <span>Sending...</span>
                            ) : (
                                <>
                                    Send Code
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="ml-2 h-4 w-4"
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
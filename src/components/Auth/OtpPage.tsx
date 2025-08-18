"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useOtpUserMutation } from "@/redux/api/authApi";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/Input-Otp";
import { toast } from "sonner";

const otpSchema = z.object({
    otp: z
        .string()
        ?.length(4, "OTP must be exactly 4 digits")
        .regex(/^[0-9]+$/, "OTP must contain only numbers"),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function OtpPage() {
    const [otpUser, { isLoading }] = useOtpUserMutation();
    const router = useRouter();
    const getEmail = localStorage.getItem("email");

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<OTPFormData>({
        resolver: zodResolver(otpSchema),
    });

    const onSubmit = async (data: OTPFormData) => {

        try {
            const body = {
                email: getEmail,
                otp: Number(data?.otp)
            }
            const response = await otpUser(body).unwrap();
            reset();
            router.push("/reset-password");
            toast.success(response?.message);
        } catch (err) {
            console.log("Error:", err);
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
        <div className="flex min-h-screen items-center font-sans justify-center bg-white p-4">
            <div className="w-full max-w-[550px] space-y-8 bg-[#F8F8F8] rounded-2xl p-12">
                {/* Success Icon */}
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="font-semibold font-outfit text-xl md:text-4xl">
                        Verification code
                    </h1>
                    <p className="text-center text-sm text-slate-600 ">
                        We have sent a verification code to your{" "}
                        <span className="text-[#00A8CC] hover:underline cursor-pointer">{getEmail}</span>
                    </p>
                </div>

                {/* OTP Input Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-center">
                        <Controller
                            name="otp"
                            control={control}
                            render={({ field }) => (
                                <InputOTP {...field} maxLength={6}>
                                    <InputOTPGroup className="flex gap-6">
                                        {[...Array(4)].map((_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className="md:h-[56px] md:w-[55.67px] h-[36px] w-[35.67px] rounded-[8px] border border-[#98A2B3]"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />
                    </div>

                    {/* OTP Error Message */}
                    {errors.otp && (
                        <p className="text-center text-sm text-red-500">
                            {errors?.otp?.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#00A8CC] hover:bg-[#00A8CC80] text-white font-bold rounded-lg mt-2 flex justify-center items-center font-outfit text-[18px] py-[10px] cursor-pointer transition-colors duration-300 ease-in-out"
                    >
                        {isLoading ? "Verifing..." : "Verify"}
                    </button>

                    <div className="text-center">
                        <p className="text-xl text-slate-600">Don&apos;t receive the code?</p>
                        <Link href={"/forgot-password"} className="text-[#00A8CC] hover:underline">
                            Resent
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
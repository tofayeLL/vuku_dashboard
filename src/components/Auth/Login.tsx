/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import preview from "@/assets/preview.png";

import logo from "@/assets/logo.png";
import logo2 from "@/assets/logo2.png";
import TextField from "@mui/material/TextField";
import { useLoginMutation } from "@/redux/api/authApi";
import { Alert, Spin } from "antd";
import { toast } from "sonner";
import { LoadingOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { setUser } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const customIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#fff" }} spin />
);

export default function Login() {
  const [email, setEmail] = useState("yourname@gmail.com");
  const [password, setPassword] = useState("********");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRouter();
  // const authState = useSelector((state: RootState) => state.auth);
  // console.log(authState);
  /*   const authState = useSelector(useAuth);
  console.log(authState); */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      email: email,
      password: password,
    };

    try {
      const response = await login({ body }).unwrap();
      if (response.success) {
        toast.success(response.message);
        Cookies.set("token", response?.result?.accessToken);
        Cookies.set("role", response.result?.adminInfo?.role);
        dispatch(setUser(response.result));
        console.log(response);
        console.log(response?.result?.accessToken);
        console.log(response.result.adminInfo.role);
        console.log(response.result);
        route.push("/");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      console.log("Execution completed.");
    }
  };

  //   const handleGoogleLogin = () => {
  //     console.log("Google login attempt");
  //   };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Ocean Background */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={preview}
          alt="preview image"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="w-full max-w-xl ">
          {/* Logo and Brand */}
          <div className="flex flex-col items-start justify-center mb-8 px-6 xl:px-0 gap-2">
            <Image
              src={logo}
              height={100}
              width={100}
              alt="Logo"
              className=""
              priority
            />
            <Image
              src={logo2}
              height={100}
              width={100}
              alt="Logo"
              className=""
              priority
            />
          </div>

          <div className="flex-grow"></div>

          {/* Login Form */}
          <div className="lg:space-y-10 space-y-6 lg:my-24 my-4 lg:px-0 px-4">
            <div className="text-start">
              <h2 className="text-3xl font-bold text-[#1C2634]">Login</h2>
              <p className="lg:mt-5 mt-2 text-[#6C7278] font-medium">
                {"Let's login into your account first"}
              </p>
            </div>

            <form onSubmit={handleLogin} className="lg:space-y-10 space-y-6">
              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="sr-only">
                  Email address
                </Label>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  autoComplete="current-password"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4 border border-[#DCE4E8] rounded-full focus:border-[#54BB52] focus:ring-[#54BB52] w-full bg-none"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <div className="relative">
                  <TextField
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 px-4 border  rounded-full focus:border-[#54BB52] focus:ring-[#54BB52] w-full bg-none mt-2 "
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert
                  message={
                    (error as any)?.data?.message ||
                    (typeof error === "object" && "message" in error
                      ? (error as any).message
                      : "An error occurred")
                  }
                  type="error"
                  showIcon
                />
              )}

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-gray-600 cursor-pointer font-medium"
                  >
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password">
                  <button
                    type="button"
                    className="text-[#FB5833] hover:underline font-normal"
                  >
                    Forgot Password
                  </button>
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#54BB52] hover:bg-[#54BB52] text-white font-bold rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    Logging <Spin indicator={customIcon} />
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Divider */}
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-gray-50 text-[#6C7278] font-medium">
                    or
                  </span>
                </div>
              </div> */}

              {/* Google Login Button */}
              {/* <Button
                type="button"
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50 text-[#1A1C1E] font-bold rounded-lg transition-colors bg-transparent"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Login with Google
              </Button> */}

              {/* Register Link */}
              {/* <div className="text-center">
                <span className="text-[#6C7278] font-medium">
                  {"Don't have an account? "}
                </span>
                <button
                  type="button"
                  className="text-[#00A8CC] hover:underline font-bold"
                >
                  Register Here
                </button>
              </div> */}
            </form>
          </div>

          <div className="flex-grow"></div>

          {/* Footer */}
          <div className="flex  text-sm">
            <p className="text-[#6C7278] font-medium ">
              © 2025 Baraka Dish. All rights reserved.
            </p>
         
             
              <p className="ml-6 text-[#54BB52]">Terms & Condition</p> 
              <span className="ml-4 text-gray-400">|</span>
              <p className="ml-4 text-[#54BB52]">Privacy & Policy</p>
            
          </div>
        </div>
      </div>
    </div>
  );
}

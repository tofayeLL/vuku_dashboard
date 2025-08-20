/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import preview from "@/assets/preview.png";

import logo from "@/assets/logo.png";
import logo2 from "@/assets/logo2.png";
import TextField from "@mui/material/TextField";
import { useLoginMutation } from "@/redux/api/authApi";
import { Alert, Spin, Modal } from "antd";
import { toast } from "sonner";
import { LoadingOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { setUser } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { messaging } from "@/lib/firebase";
import { getToken, Messaging } from "firebase/messaging";

const customIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#fff" }} spin />
);

const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    try {
      const token = await getToken(messaging as Messaging, {
        vapidKey:
          "BE2GwQzKBZKyQUNC-QLCNXQY1pg_WfnlHyltdlT6EFaxdRi1mbEzowoUQd9k2Xx3fUw-CVH-9_9Qpv3EuGUOYjs",
      });
      return token;
    } catch (err) {
      console.error("Error getting FCM token:", err);
      throw err;
    }
  } else {
    throw new Error("Notification permission denied");
  }
};

const Login = () => {
  const [email, setEmail] = useState("yourname@gmail.com");
  const [password, setPassword] = useState("********");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<'pending' | 'granted' | 'denied' | 'skipped'>('pending');
  const dispatch = useDispatch<AppDispatch>();
  const route = useRouter();

  // Check notification permission status on component mount
  useEffect(() => {
    if (Notification.permission === "default") {
      // Show modal to ask for notification permission
      setNotificationModalVisible(true);
      setNotificationStatus('pending');
    } else if (Notification.permission === "granted") {
      setNotificationEnabled(true);
      setNotificationStatus('granted');
      // Get FCM token immediately if permission is already granted
      getFcmToken();
    } else {
      setNotificationStatus('denied');
    }
  }, []);

  const getFcmToken = async () => {
    try {
      const token = await getToken(messaging as Messaging, {
        vapidKey:
          "BE2GwQzKBZKyQUNC-QLCNXQY1pg_WfnlHyltdlT6EFaxdRi1mbEzowoUQd9k2Xx3fUw-CVH-9_9Qpv3EuGUOYjs",
      });
      setFcmToken(token);
      return token;
    } catch (err) {
      console.error("Error getting FCM token:", err);
      setFcmToken(null);
      return null;
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const token = await requestPermission();
      if (token) {
        setNotificationEnabled(true);
        setFcmToken(token);
        setNotificationStatus('granted');
        toast.success("Notifications enabled successfully!");
      }
    } catch (err) {
      console.error("Failed to enable notifications:", err);
      setFcmToken(null);
      setNotificationStatus('denied');
      toast.error("Failed to enable notifications. Please check your browser settings.");
    } finally {
      setNotificationModalVisible(false);
    }
  };

  const handleSkipNotifications = () => {
    setNotificationModalVisible(false);
    setFcmToken(null);
    setNotificationStatus('skipped');
    toast.info("You can turn on from user profile after");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If notification modal is still visible, handle notification first
    if (notificationModalVisible) {
      toast.info("Please choose your notification preference first.");
      return;
    }

    let tokenToSend = fcmToken;

    // If user hasn't made a notification decision yet and permission is default
    if (notificationStatus === 'pending' && Notification.permission === "default") {
      setNotificationModalVisible(true);
      return;
    }

    // If permission is granted but we don't have token, try to get it
    if (Notification.permission === "granted" && !fcmToken) {
      try {
        tokenToSend = await getFcmToken();
      } catch (err) {
        console.error("Error getting FCM token during login:", err);
        tokenToSend = null;
      }
    }

    // If user skipped or denied, send null
    if (notificationStatus === 'skipped' || notificationStatus === 'denied') {
      tokenToSend = null;
    }
    
    const body = {
      email: email,
      password: password,
      fcmToken: tokenToSend, // This will be null if skipped/denied, or the actual token if granted
    };

    try {
      const response = await login({ body }).unwrap();
      console.log("login page", response);
      console.log(response?.result?.accessToken);
      if (response.success) {
        toast.success(response.message);
        Cookies.set("token", response?.result?.accessToken);
        dispatch(setUser(response.result));
        console.log("login page", response);
        console.log("FCM Token sent:", tokenToSend);
        route.push("/");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      console.log("Execution completed.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Notification Permission Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#54BB52]" />
            <span>Enable Notifications</span>
          </div>
        }
        open={notificationModalVisible}
        onCancel={handleSkipNotifications}
        footer={[
          <Button key="skip" variant="outline" onClick={handleSkipNotifications}>
            Skip for Now
          </Button>,
          <Button key="enable" onClick={handleEnableNotifications} className="bg-[#54BB52] hover:bg-[#54BB52] ml-3">
            Enable Notifications
          </Button>,
        ]}
        className="rounded-lg"
      >
        <div className="py-4">
          <p className="text-gray-700 mb-2">
            Stay updated with important alerts and messages by enabling notifications.
          </p>
          <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-md">
            <Bell className="h-5 w-5 text-[#54BB52] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#54BB52]">What to expect:</p>
              <ul className="text-xs text-[#54BB52] mt-1 list-disc pl-4">
               {/*  <li>Order updates and status changes</li>
                <li>Special offers and promotions</li> */}
                <li>Important account notifications</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            You can not get notify for any notification.
          </p>
        </div>
      </Modal>
      
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
                    className="h-12  border  rounded-full focus:border-[#54BB52] focus:ring-[#54BB52] w-full bg-none mt-2 "
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base bg-[#54BB52] hover:bg-[#54BB52] text-white font-bold rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    Logging <Spin indicator={customIcon} />
                  </>
                ) : (
                  "Login"
                )}
              </Button>
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
};

export default Login;
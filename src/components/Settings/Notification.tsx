import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Bell, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { messaging } from "@/lib/firebase";
import { getToken, Messaging } from "firebase/messaging";
import { useUpdateMyProfileMutation } from "@/redux/api/settingsApi";

interface NotificationPermissionState {
  permission: NotificationPermission;
  fcmToken: string | null;
  isRequesting: boolean;
}

// Frontend storage keys
const NOTIFICATION_ENABLED_KEY = 'notificationsEnabled';

const Notifications = () => {
  const [updateMyProfile] = useUpdateMyProfileMutation();

  const [notificationEnabled, setNotificationEnabled] = useState(() => {
    // Initialize from localStorage on component mount
    const saved = localStorage.getItem(NOTIFICATION_ENABLED_KEY);
    return saved ? JSON.parse(saved) : false;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [permissionState, setPermissionState] =
    useState<NotificationPermissionState>({
      permission: Notification?.permission || "default",
      fcmToken: null,
      isRequesting: false,
    });

  // Save notification state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(NOTIFICATION_ENABLED_KEY, JSON.stringify(notificationEnabled));
  }, [notificationEnabled]);

  // Check notification permission and get token on component mount
  useEffect(() => {
    initializeNotificationPermission();
  }, []);

  const initializeNotificationPermission = async () => {
    try {
      const currentPermission = Notification.permission;
      
      if (currentPermission === "granted") {
        // If user has notifications enabled in localStorage and browser permission is granted,
        // get the FCM token
        if (notificationEnabled) {
          try {
            const token = await getToken(messaging as Messaging, {
              vapidKey: "BE2GwQzKBZKyQUNC-QLCNXQY1pg_WfnlHyltdlT6EFaxdRi1mbEzowoUQd9k2Xx3fUw-CVH-9_9Qpv3EuGUOYjs",
            });
            
            setPermissionState({
              permission: "granted",
              fcmToken: token,
              isRequesting: false,
            });
            
            console.log("FCM token obtained during initialization:", token);
          } catch (error) {
            console.error("Error getting FCM token during initialization:", error);
            setPermissionState({
              permission: "granted",
              fcmToken: null,
              isRequesting: false,
            });
          }
        } else {
          // User has disabled notifications, so don't get token
          setPermissionState({
            permission: "granted",
            fcmToken: null,
            isRequesting: false,
          });
        }
      } else {
        setPermissionState({
          permission: currentPermission,
          fcmToken: null,
          isRequesting: false,
        });
        
        // If permission is denied but user had enabled notifications,
        // reset the localStorage state
        if (currentPermission === "denied" && notificationEnabled) {
          setNotificationEnabled(false);
        }
      }
      
      setIsInitialized(true);
      console.log("Notification state initialized:", {
        frontendEnabled: notificationEnabled,
        browserPermission: currentPermission,
      });
      
    } catch (error) {
      console.error("Error initializing notification state:", error);
      setIsInitialized(true);
    }
  };

  const requestNotificationPermission = async () => {
    setPermissionState((prev) => ({ ...prev, isRequesting: true }));

    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging as Messaging, {
          vapidKey:
            "BE2GwQzKBZKyQUNC-QLCNXQY1pg_WfnlHyltdlT6EFaxdRi1mbEzowoUQd9k2Xx3fUw-CVH-9_9Qpv3EuGUOYjs",
        });

        setPermissionState({
          permission: "granted",
          fcmToken: token,
          isRequesting: false,
        });

        return token;
      } else {
        setPermissionState({
          permission: permission,
          fcmToken: null,
          isRequesting: false,
        });

        return null;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setPermissionState((prev) => ({ ...prev, isRequesting: false }));
      return null;
    }
  };

  const updateNotificationSettingsAPI = async (fcmToken: string | null) => {
    try {
      console.log("Sending FCM token to backend:", fcmToken);
      const body = { fcmToken };
      const response = await updateMyProfile(body).unwrap();
      console.log("Notification settings updated:", response);
      return response;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw error;
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    setIsLoading(true);

    try {
      if (enabled) {
        // User wants to enable notifications
        let tokenToSend = null;

        if (
          permissionState.permission === "granted" &&
          permissionState.fcmToken
        ) {
          // Already has permission and token, use existing token
          tokenToSend = permissionState.fcmToken;
          console.log("Using existing FCM token:", tokenToSend);
        } else {
          // Need to request permission
          tokenToSend = await requestNotificationPermission();

          if (!tokenToSend) {
            // Permission was denied
            toast.error(
              "Notification permission was denied. Please enable it in your browser settings."
            );
            setNotificationEnabled(false);
            setIsLoading(false);
            return;
          }
          console.log("New FCM token obtained:", tokenToSend);
        }

        // Update API with FCM token
        await updateNotificationSettingsAPI(tokenToSend);
        
        // Update local state - this will automatically save to localStorage via useEffect
        setNotificationEnabled(true);
        toast.success("Notifications enabled successfully!");
        
      } else {
        // User wants to disable notifications
        await updateNotificationSettingsAPI(null);
        
        // Update local state - this will automatically save to localStorage via useEffect
        setNotificationEnabled(false);
        toast.success("Notifications disabled successfully!");

        // Update permission state to reflect the change
        setPermissionState((prev) => ({
          ...prev,
          fcmToken: null,
        }));
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings. Please try again.");
      // Revert the toggle state on error
      setNotificationEnabled(!enabled);
    } finally {
      setIsLoading(false);
    }
  };

  const isToggleDisabled = isLoading || permissionState.isRequesting || !isInitialized;

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="p-6 rounded-lg">
        <div className="flex items-center gap-2 border-b pb-6 mb-6">
          <h1 className="text-lg font-medium text-[#30373D]">Notifications</h1>
        </div>
        <p className="text-sm text-gray-500">Loading notification settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg">
      <div className="flex items-center gap-2 border-b pb-6 mb-6">
        <h1 className="text-lg font-medium text-[#30373D]">Notifications</h1>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent className="text-white">
            <p>Enable or disable browser notifications</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Permission Status Alert */}
      {permissionState?.permission === "denied" && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            Browser notifications are blocked. Please enable them in your
            browser settings to receive notifications.
          </AlertDescription>
        </Alert>
      )}

      {/* Permission Status Indicator */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <Bell className="h-4 w-4" />
        <span className="text-gray-600">
          Browser Permission:
          <span
            className={`ml-1 font-medium ${
              permissionState?.permission === "granted"
                ? "text-green-600"
                : permissionState.permission === "denied"
                ? "text-red-600"
                : "text-orange-600"
            }`}
          >
            {permissionState?.permission === "granted" && "Granted"}
            {permissionState?.permission === "denied" && "Blocked"}
            {permissionState?.permission === "default" && "Not Set"}
          </span>
        </span>
      </div>

      {/* Notification Status Indicator */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <Bell className="h-4 w-4" />
        <span className="text-gray-600">
          Notifications Status:
          <span
            className={`ml-1 font-medium ${
              notificationEnabled ? "text-green-600" : "text-gray-600"
            }`}
          >
            {notificationEnabled ? "Enabled" : "Disabled"}
          </span>
        </span>
      </div>

      <Card className="p-0 border-[#54BB52]/20 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label
                htmlFor="notifications"
                className="text-base font-medium text-[#30373D] cursor-pointer"
              >
                Enable Notifications
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="text-white">
                  <p>Toggle to enable or disable all notifications</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="notifications"
              checked={notificationEnabled}
              onCheckedChange={handleNotificationToggle}
              disabled={isToggleDisabled}
              className="data-[state=checked]:bg-[#54BB52] disabled:opacity-50"
            />
          </div>

          {isLoading && (
            <p className="text-sm text-gray-500 mt-2">
              {permissionState.isRequesting
                ? "Requesting permission..."
                : "Updating settings..."}
            </p>
          )}
        </CardContent>
      </Card>

      {permissionState.permission === "denied" && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>To enable notifications:</strong>
          </p>
          <ol className="text-sm text-gray-600 mt-2 list-decimal list-inside space-y-1">
            <li>Click on the lock/shield icon in your address bar</li>
            <li>Change the notification setting to Allow</li>
            <li>Refresh this page and try again</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default Notifications;
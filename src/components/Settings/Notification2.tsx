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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { messaging } from "@/lib/firebase";
import { getToken, Messaging } from "firebase/messaging";

interface NotificationSettings {
  productUpdates: boolean;
  comments: boolean;
  checkoutProduct: boolean;
}

interface NotificationPermissionState {
  permission: NotificationPermission;
  fcmToken: string | null;
  isRequesting: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    productUpdates: false,
    comments: false,
    checkoutProduct: false,
  });

  const [permissionState, setPermissionState] = useState<NotificationPermissionState>({
    permission: Notification.permission,
    fcmToken: null,
    isRequesting: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Check notification permission and get token on component mount
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    if (Notification.permission === "granted") {
      try {
        const token = await getToken(messaging as Messaging, {
          vapidKey: "BE2GwQzKBZKyQUNC-QLCNXQY1pg_WfnlHyltdlT6EFaxdRi1mbEzowoUQd9k2Xx3fUw-CVH-9_9Qpv3EuGUOYjs",
        });
        setPermissionState({
          permission: "granted",
          fcmToken: token,
          isRequesting: false,
        });
      } catch (error) {
        console.error("Error getting FCM token:", error);
        setPermissionState({
          permission: "granted",
          fcmToken: null,
          isRequesting: false,
        });
      }
    } else {
      setPermissionState({
        permission: Notification.permission,
        fcmToken: null,
        isRequesting: false,
      });
    }
  };

  const requestNotificationPermission = async () => {
    setPermissionState(prev => ({ ...prev, isRequesting: true }));
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        const token = await getToken(messaging as Messaging, {
          vapidKey: "BE2GwQzKBZKyQUNC-QLCNXQY1pg_WfnlHyltdlT6EFaxdRi1mbEzowoUQd9k2Xx3fUw-CVH-9_9Qpv3EuGUOYjs",
        });
        
        setPermissionState({
          permission: "granted",
          fcmToken: token,
          isRequesting: false,
        });
        
        toast.success("Notifications enabled successfully!");
        return token;
      } else {
        setPermissionState({
          permission: permission,
          fcmToken: null,
          isRequesting: false,
        });
        
        toast.error("Notification permission denied. Please enable it in your browser settings.");
        return null;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setPermissionState(prev => ({ ...prev, isRequesting: false }));
      toast.error("Failed to request notification permission.");
      return null;
    }
  };

  const handleNotificationChange = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    // If user is turning ON any notification and permission is not granted
    if (value && permissionState.permission !== "granted") {
      const token = await requestNotificationPermission();
      if (!token) {
        // If permission was denied, don't update the state
        return;
      }
    }

    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const updateNotificationSettingsAPI = async (settings: NotificationSettings, fcmToken: string | null) => {
    // Replace this with your actual API endpoint
    try {
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on how you store the token
        },
        body: JSON.stringify({
          notificationSettings: settings,
          fcmToken: fcmToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Check if any notifications are enabled
      const hasEnabledNotifications = Object.values(notifications).some(value => value);
      
      let tokenToSend = null;
      
      if (hasEnabledNotifications) {
        if (permissionState.permission !== "granted") {
          // Request permission if not granted
          tokenToSend = await requestNotificationPermission();
          if (!tokenToSend) {
            setIsSaving(false);
            return;
          }
        } else {
          tokenToSend = permissionState.fcmToken;
        }
      }
      
      // Call API to save settings
      await updateNotificationSettingsAPI(notifications, tokenToSend);
      
      console.log("Saving notification settings:", {
        settings: notifications,
        fcmToken: tokenToSend,
      });
      
      toast.success("Notification settings saved successfully!");
      
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Failed to save notification settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasAnyNotificationEnabled = Object.values(notifications).some(value => value);
  const showPermissionAlert = hasAnyNotificationEnabled && permissionState.permission !== "granted";

  return (
    <div className="p-6 rounded-lg">
      <div className="flex items-center gap-2 border-b pb-6 mb-6">
        <h1 className="text-lg font-medium text-[#30373D]">Notification</h1>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent className="text-white">
            <p>Manage your notification preferences</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Permission Status Alert */}
      {showPermissionAlert && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700">
            Browser notification permission is required to receive notifications. 
            <Button 
              variant="link" 
              className="h-auto p-0 ml-1 text-orange-600 underline"
              onClick={requestNotificationPermission}
              disabled={permissionState.isRequesting}
            >
              {permissionState.isRequesting ? "Requesting..." : "Click here to enable"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Permission Status Indicator */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <Bell className="h-4 w-4" />
        <span className="text-gray-600">
          Browser Notifications: 
          <span className={`ml-1 font-medium ${
            permissionState.permission === "granted" 
              ? "text-green-600" 
              : permissionState.permission === "denied"
              ? "text-red-600"
              : "text-orange-600"
          }`}>
            {permissionState.permission === "granted" && "Enabled"}
            {permissionState.permission === "denied" && "Blocked"}
            {permissionState.permission === "default" && "Not Set"}
          </span>
        </span>
      </div>

      <Card className="p-0 border-[#54BB52]/20 bg-white">
        <CardContent className="space-y-7">
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <Label
                htmlFor="product-updates"
                className="text-sm font-medium text-[#30373D]"
              >
                Product updates
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="text-white">
                  <p>Get notified about new product features</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="product-updates"
              checked={notifications.productUpdates}
              onCheckedChange={(checked) =>
                handleNotificationChange("productUpdates", checked)
              }
              className="data-[state=checked]:bg-[#54BB52]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="comments"
                className="text-sm font-medium text-[#30373D]"
              >
                Comments
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="text-white">
                  <p>Get notified about new comments</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="comments"
              checked={notifications.comments}
              onCheckedChange={(checked) =>
                handleNotificationChange("comments", checked)
              }
              className="data-[state=checked]:bg-[#54BB52]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="checkout-product"
                className="text-sm font-medium text-[#30373D]"
              >
                Checkout Product
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="text-white">
                  <p>Get notified about checkout updates</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="checkout-product"
              checked={notifications.checkoutProduct}
              onCheckedChange={(checked) =>
                handleNotificationChange("checkoutProduct", checked)
              }
              className="data-[state=checked]:bg-[#54BB52]"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-[#54BB52] hover:bg-[#358f34] text-white px-8 mt-6"
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default Notifications;
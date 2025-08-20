"use client";

import { useEffect } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage, Messaging } from "firebase/messaging";

export function useFirebaseNotifications() {
  useEffect(() => {
    if (!messaging) return;

    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          const token = await getToken(messaging as Messaging, {
            vapidKey:
              "BE2GwQzKBZKyQUNC-QLCNXQY1pg_WfnlHyltdlT6EFaxdRi1mbEzowoUQd9k2Xx3fUw-CVH-9_9Qpv3EuGUOYjs",
          });
          console.log("FCM Token:", token);

          // Send token to backend
          //   await fetch("/api/save-fcm-token", {
          //     method: "POST",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify({ token }),
          //   });
        } catch (err) {
          console.error("Error getting FCM token:", err);
        }
      }
    };

    requestPermission();

    // Foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);
      alert(`${payload.notification?.title}: ${payload.notification?.body}`);
    });

    return () => unsubscribe();
  }, []);
}

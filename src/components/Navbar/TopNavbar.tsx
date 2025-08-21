"use client";

import React, { useState } from "react";
import {  Modal, message as AntMessage, Popconfirm } from "antd";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdDelete, MdExpandMore, MdExpandLess } from "react-icons/md";

// import { LuMessageCircleMore } from "react-icons/lu";
import Image from "next/image";
// import { useGetMyProfileQuery } from "@/redux/api/settingsApi";
import {

  useGetAdminNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation, // Add this import
} from "@/redux/api/notifiyApi";
import { formatChatDate } from "@/lib/formateTimeStamp";

import userImage from "@/assets/images/userImage.jpg";
import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { Loading } from "../ui/loading";
import { Badge } from "antd";
import Link from "next/link";
/* import { useSelector } from "react-redux";
import { useAuth } from "@/redux/features/authSlice"; */

// import Link from "next/link";


type NotificationType = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

/* type UpdateNotificationPayload = {
  id: string;
 
}; */

const TopNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  const {data: userProfile, isLoading} = useGetSingleUserQuery({});

  const { data: notificationsData, refetch } = useGetAdminNotificationsQuery({});
  const [updateNotification] = useUpdateNotificationMutation();

  const [deleteNotification] = useDeleteNotificationMutation(); // Add this hook
  

  const notifications: NotificationType[] = notificationsData?.result || [];
  console.log("update notification",notifications);

  

 /*  const authState = useSelector(useAuth)
  console.log("to navbar",authState);
  console.log("to navbar",authState?.adminInfo?.profileImage); */

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  console.log("top navbar", userProfile);

  const handleMarkAsRead = async (id: string) => {
    console.log("notif id",id);
   
    try {
      await updateNotification(id).unwrap();
      AntMessage.success("Marked as read");
      refetch();
    } catch {
      AntMessage.error("Failed to mark as read");
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      AntMessage.success("Notification deleted successfully");
      refetch();
      // Remove from expanded set if it was expanded
      setExpandedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch {
      AntMessage.error("Failed to delete notification");
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-white">
        <div className="flex items-center justify-center space-x-2">
          <Loading></Loading>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white flex justify-between items-center gap-2 font-bold w-full h-[81px] px-4 md:px-6 py-4 sticky top-0 z-40  ">
        <h1 className="md:text-3xl flex justify-center items-center gap-5">Overview</h1>

        <div className="flex  gap-6">
            {/* message Icon */}
       {/*   <Link href="/message">
          <div
            className="bg-white shadow rounded-full px-2 py-1 h-full cursor-pointer"
           
          >
            <Badge count={unreadCount} size="small">
              <LuMessageCircleMore className="w-6 h-6 text-gray-500" />
            </Badge>
          </div>
         </Link> */}
           {/* Notification Icon */}
         <Link href={""}>
          <div
            className="bg-white shadow rounded-full px-2 py-1 h-full cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Badge count={unreadCount} size="small">
              <IoMdNotificationsOutline className="w-6 h-6 text-gray-500" />
            </Badge>
          </div>
         </Link>

          {/* Profile */}
          <div >
            <Image
              src={userProfile?.result?.profileImage ||  userImage}
              height={50}
              width={50}
              alt="avatar"
              className="rounded-full w-10 h-10 object-cover"
              priority
            />
        
           
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      <Modal
        title="Notifications"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        {notifications?.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications found.</p>
        ) : (
          <ul className="space-y-4 max-h-[400px] overflow-y-auto">
            {notifications?.map((notif) => {
              const isExpanded = expandedNotifications.has(notif.id);
              const shouldShowExpand = notif.body.length > 100;
              
              return (
                <li
                  key={notif.id}
                  className={`border rounded-lg p-3 shadow-sm ${
                    notif.isRead ? "bg-white" : "bg-[#F0F9FF]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="font-semibold">{notif.title}</p>
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">
                          {isExpanded ? notif.body : truncateText(notif.body)}
                        </p>
                        {shouldShowExpand && (
                          <button
                            onClick={() => toggleExpanded(notif.id)}
                            className="flex items-center gap-1 text-blue-500 hover:underline text-xs"
                          >
                            {isExpanded ? (
                              <>
                                <MdExpandLess className="w-4 h-4" />
                                Show less
                              </>
                            ) : (
                              <>
                                <MdExpandMore className="w-4 h-4" />
                                Show more
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatChatDate(notif.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          notif.isRead
                            ? "bg-gray-200 text-gray-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {notif.isRead ? "Read" : "Unread"}
                      </span>

                      <div className="flex flex-col space-y-1">
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notif?.id)}
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        
                        <Popconfirm
                          title="Delete notification"
                          description="Are you sure you want to delete this notification?"
                          onConfirm={() => handleDeleteNotification(notif.id)}
                          okText="Yes"
                          cancelText="No"
                          placement="topRight"
                        >
                          <button className="flex items-center gap-1 text-xs text-red-500 hover:underline">
                            <MdDelete className="w-3 h-3" />
                            Delete
                          </button>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Modal>
    </>
  );
};

export default TopNavbar;
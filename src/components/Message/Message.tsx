/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BsArrowLeft } from "react-icons/bs";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import link from "@/assets/link.svg";
import Image from "next/image";
import ChatSidebar from "./ChatSideBar";
import { formatChatDate } from "@/lib/formateTimeStamp";
import { Modal, Button as Buttons } from "antd";
// import { useGetAllLeadersQuery } from "@/redux/api/userApi";
import { toast } from "sonner";
import { useInviteGroupMutation } from "@/redux/api/groupApi";
import { useSelector } from "react-redux";
import { useAuth } from "@/redux/features/authSlice";
// import { useGetAllWardensQuery } from "@/redux/api/wardensApi";

type ChatMessage = {
  id: number;
  userId: string;
  content: string;
  timestamp?: string;
  partner: {
    fullName: string;
    profileImage: string;
    id: string;
  };
};

type GroupMessage = {
  id: number;
  groupId: string;
  content: string;
  fileUrl: [];
  createdAt: string;
};

type GettingChat = {
  id: number;
  user1Id: string;
  content: string;
  createdAt: string;
};

type MemberConversation = {
  roomId: string;
  partner?: {
    id: string;
    fullName: string;
    profileImage?: string;
    isActive?: boolean;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
};

type GroupConversation = {
  roomId: string;
  groupName: string;
  groupPhoto?: string;
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
};

type UserType = {
  id: string;
  fullName: string;
  profileImage?: string | null;
  status: string;
  email: string;
};

export default function Message() {
  const [selectedRoom, setSelectedRoom] = useState<string>("Select Room");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [memberConversations, setMemberConversations] = useState<
    MemberConversation[]
  >([]);
  const [groupConversations, setGroupConversations] = useState<
    GroupConversation[]
  >([]);

  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [groupMessages, setGroupMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [joinModal, setJoinModal] = useState(false);
  const [users, /* setUsers */] = useState<UserType[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [addMembers] = useInviteGroupMutation();
  const authState = useSelector(useAuth);

/*   const { data: leaders } = useGetAllLeadersQuery({
    page: 1,
    role: authState?.role === "Admin" && "Leader",
    limit: 1000,
    groupId: roomId,
  }); */

/*   const { data: wardens } = useGetAllWardensQuery({
    page: 1,
    limit: 100,
    groupId: roomId,
  }); */

  useEffect(() => {
    const getTokenFromCookies = () => {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      return cookie?.split("=")[1];
    };

    const token = getTokenFromCookies();
    if (!token) {
      console.warn("⚠️ No token found in cookies");
      return;
    }
    const socket = new WebSocket(`wss://api.elvevakt.no?x-token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "member-conversation":
            setMemberConversations(data.conversations);
            break;

          case "member-new-message": {
            const msg = data.message;
            const newMessage: ChatMessage = {
              id: chatMessages.length,
              userId: msg.user1Id,
              content: msg.content,
              timestamp: msg.createdAt,
              partner: msg.partner,
            };
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
            break;
          }

          case "past-messages":
            setChatMessages(
              data.messages
                .reverse()
                .map((msg: GettingChat, index: number) => ({
                  id: index,
                  userId: msg?.user1Id,
                  content: msg?.content,
                  timestamp: msg?.createdAt,
                }))
            );
            break;

          case "group-conversation":
            setGroupConversations(data.conversations);
            break;

          case "group-messages":
            setGroupMessages(
              data?.messages
                .reverse()
                .map((msg: GroupMessage, index: number) => ({
                  id: index,
                  groupId: msg?.groupId,
                  content: msg?.content,
                  fileUrl: msg?.fileUrl,
                  timestamp: msg?.createdAt,
                }))
            );
            break;

          case "group-new-message": {
            const msg = data.message;
            const newMessage: any = {
              id: chatMessages.length,
              content: msg.content,
              timestamp: msg.createdAt,
            };
            setGroupMessages((prevMessages) => [...prevMessages, newMessage]);
            break;
          }

          default:
            console.log("Unknown message type:", data.type);
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    return () => {
      socket.close(); // cleanup on unmount
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

/*   useEffect(() => {
    setUsers(leaders?.result.users);
  }, [leaders?.result]);

  useEffect(() => {
    setUsers(wardens?.result.wardens);
  }, [wardens?.result]); */

  const handleSendMessage = () => {
    if (!messageInput.trim() || !receiverId || !socketRef.current) return;

    const messagePayload = {
      type: "member-send-message",
      receiverId,
      content: messageInput.trim(),
      fileUrl: [], // or pass uploaded file URLs if any
    };

    socketRef.current.send(JSON.stringify(messagePayload));
    setMessageInput("");
  };

  const handleSendGroupMessage = () => {
    if (!messageInput.trim() || !socketRef.current) return;

    const messagePayload = {
      type: "send-group-message",
      content: messageInput.trim(),
      fileUrl: [],
    };

    socketRef.current.send(JSON.stringify(messagePayload));
    setMessageInput("");
  };

  const handleSelectChat = (conv: MemberConversation) => {
    setSelectedRoom(conv?.partner?.fullName ?? "Select Room");
    setReceiverId(conv?.partner?.id ?? null);
    setRoomId(null);

    socketRef.current?.send(
      JSON.stringify({
        type: "member-subscribe",
        receiverId: conv?.partner?.id,  
      })
    );
  };

  const handleSelectGroupChat = (group: GroupConversation) => {
    setReceiverId("");
    setSelectedRoom(group?.groupName);
    setRoomId(group?.roomId);
    socketRef.current?.send(
      JSON.stringify({
        type: "group-subscribe",
        receiverId: group.roomId,
      })
    );
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    const data = {
      memberIds: selectedUserIds,
    };

    try {
      const response = await addMembers({ id: roomId, data });
      if ("data" in response) {
        toast.success("Members added successfully");
        setJoinModal(false);
        setSelectedUserIds([]);
      } else {
        toast.error("Failed to add members");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="flex h-screen gap-6 text-[rgb(28,26,60)]">
      {/* Left Sidebar - Chat List */}
      <ChatSidebar
        socket={socketRef.current}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setSelectedChat={handleSelectChat}
        setSelectedGroupChat={handleSelectGroupChat}
        memberConversations={memberConversations.map(
          (conv: MemberConversation) => ({
            ...conv,
            lastMessage:
              conv?.lastMessage?.content == null
                ? undefined
                : {
                    content: conv?.lastMessage.content,
                    createdAt: conv?.lastMessage.createdAt,
                  },
          })
        )}
        groupConversations={groupConversations.map((conv) => ({
          ...conv,
          lastMessage:
            conv?.lastMessage?.content == null
              ? undefined
              : {
                  content: conv?.lastMessage.content,
                  createdAt: conv?.lastMessage.createdAt,
                },
        }))}
      />

      {/* Right Side - Chat Window */}
      <div className="flex-1 flex flex-col bg-white h-full rounded-xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <BsArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h2 className="font-medium text-lg">{selectedRoom}</h2>
              {/* <p className="text-xs text-[#817F9B]">43 members, 24 online</p> */}
            </div>
          </div>
          {roomId !== null &&
            (authState?.role === "Leader" || authState?.role === "Admin") && (
              <Button
                onClick={() => setJoinModal(true)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <IoEllipsisVerticalSharp className="h-5 w-5 text-[#817F9B]" />
              </Button>
            )}
        </div>

        {/* Message List */}
        {receiverId ? (
          <>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chatMessages?.map((message, index) => {
                // If the sender is the receiver, then it's their message (left)
                const isReceiverMessage = message?.userId === receiverId;
                const showAvatar =
                  index === 0 ||
                  chatMessages[index - 1]?.userId !== message.userId;

                return (
                  <div
                    key={message.id}
                    className={`flex items-center gap-3 ${
                      isReceiverMessage ? "justify-start" : "justify-end"
                    }`}
                  >
                    {!isReceiverMessage && showAvatar && (
                      <div className="w-8" />
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        isReceiverMessage ? "" : "order-1"
                      }`}
                    >
                      <div
                        className={`px-6 py-3 break-words whitespace-pre-wrap ${
                          isReceiverMessage
                            ? "bg-[#00A8CC1A] rounded-t-xl rounded-bl-xl"
                            : "bg-blue-300 rounded-t-xl rounded-br-xl"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.timestamp && (
                        <p
                          className={`text-[10px] text-[#9197B2] mt-1 ${
                            isReceiverMessage ? "text-left" : "text-right"
                          }`}
                        >
                          {formatChatDate(message.timestamp)}
                        </p>
                      )}
                    </div>

                    {isReceiverMessage && showAvatar && <div className="w-8" />}
                  </div>
                );
              })}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 border border-[#E1E5F3] px-5 py-3 rounded-2xl  ">
                <div className="flex-1 relative">
                  <div className="flex items-center">
                    <Image
                      src={link}
                      height={20}
                      width={20}
                      alt="Link"
                      className="h-5 w-5"
                      priority
                    />
                    <Input
                      placeholder="Type Messages"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="placeholder:text-sm placeholder:text-[#9197B2] outline-none border-none shadow-none"
                    />
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Paperclip className="h-5 w-5 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Smile className="h-5 w-5 text-gray-400" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#00A8CC] hover:bg-[#00A8CC80] h-10 w-10 rounded-xl p-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {groupMessages?.map((message, index) => {
                // If the sender is the receiver, then it's their message (left)
                const isReceiverMessage = message?.userId === receiverId;
                const showAvatar =
                  index === 0 ||
                  chatMessages[index - 1]?.userId !== message.userId;

                return (
                  <div
                    key={message.id}
                    className={`flex items-center gap-3 ${
                      isReceiverMessage ? "justify-start" : "justify-end"
                    }`}
                  >
                    {!isReceiverMessage && showAvatar && (
                      <div className="w-8" />
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        isReceiverMessage ? "" : "order-1"
                      }`}
                    >
                      <div
                        className={`px-6 py-3 break-words whitespace-pre-wrap ${
                          isReceiverMessage
                            ? "bg-[#00A8CC1A] rounded-t-xl rounded-bl-xl"
                            : "bg-blue-300 rounded-t-xl rounded-br-xl"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.timestamp && (
                        <p
                          className={`text-[10px] text-[#9197B2] mt-1 ${
                            isReceiverMessage ? "text-left" : "text-right"
                          }`}
                        >
                          {formatChatDate(message.timestamp)}
                        </p>
                      )}
                    </div>

                    {isReceiverMessage && showAvatar && <div className="w-8" />}
                  </div>
                );
              })}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
            {/* Message Input */}
            <div className="p-4">
              <div className="flex items-center gap-2 border border-[#E1E5F3] px-5 py-3 rounded-2xl">
                <div className="flex-1 relative">
                  <div className="flex items-center">
                    <Image
                      src={link}
                      height={20}
                      width={20}
                      alt="Link"
                      className="h-5 w-5"
                      priority
                    />
                    <Input
                      placeholder="Type Messages"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendGroupMessage()
                      }
                      className="placeholder:text-sm placeholder:text-[#9197B2] outline-none border-none shadow-none"
                    />
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Paperclip className="h-5 w-5 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Smile className="h-5 w-5 text-gray-400" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendGroupMessage}
                  className="bg-[#00A8CC] hover:bg-[#00A8CC80] h-10 w-10 rounded-xl p-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        title="Select Users to join this group"
        open={joinModal}
        onCancel={() => setJoinModal(false)}
        footer={null}
      >
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
          {users?.map((user) => (
            <label
              key={user.id}
              className="flex items-center gap-2 p-2 border rounded"
            >
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => toggleUserSelection(user.id)}
              />
              <div className="flex items-center gap-2">
                {user.profileImage ? (
                  <Image
                    height={100}
                    width={100}
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                )}
                <div>
                  <div className="font-medium">{user.fullName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        <Buttons
          type="primary"
          block
          onClick={handleAddMembers}
          className="mt-4"
        >
          Add Members
        </Buttons>
      </Modal>
    </div>
  );
}

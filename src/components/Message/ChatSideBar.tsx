/* eslint-disable @typescript-eslint/no-unused-vars */
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { formatChatDate } from "@/lib/formateTimeStamp";
import { useState } from "react";
import { Modal, Button as Buttons } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateGroupMutation } from "@/redux/api/groupApi";
import { useSelector } from "react-redux";
import { useAuth } from "@/redux/features/authSlice";

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

type Props = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  setSelectedChat: (value: MemberConversation) => void;
  setSelectedGroupChat: (value: GroupConversation) => void;
  socket: WebSocket | null;
  memberConversations: {
    roomId: string;
    partner?: {
      profileImage?: string;
      fullName?: string;
      id: string;
      isActive?: boolean;
    };
    lastMessage?: {
      content?: string;
      createdAt?: string;
    };
    unreadCount: number;
  }[];

  groupConversations: {
    roomId: string;
    groupPhoto?: string;
    groupName?: string;
    lastMessage?: {
      content?: string;
      createdAt?: string;
    };
    unreadCount: number;
  }[];
};

type GroupFormInputs = {
  groupName: string;
  groupPhoto: FileList;
};

export default function ChatSidebar({
  socket,
  searchInput,
  setSearchInput,
  setSelectedChat,
  setSelectedGroupChat,
  memberConversations,
  groupConversations,
}: Props) {
  const authState = useSelector(useAuth);
  const filteredMemberConversations = memberConversations.filter((conv) =>
    conv.partner?.fullName?.toLowerCase().includes(searchInput.toLowerCase())
  );

  const filteredGroupConversations = groupConversations.filter((group) =>
    group.groupName?.toLowerCase().includes(searchInput.toLowerCase())
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const handleCreateGroup = () => {
    setGroupModalOpen(true);
    setIsModalOpen(false);
  };

  const handleSearchUser = () => {
    console.log("Search User clicked");
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<GroupFormInputs>();

  const [createGroup] = useCreateGroupMutation();

  const onSubmit = async (data: GroupFormInputs) => {
    const formData = new FormData();

    formData.append("groupName", data.groupName);
    if (data.groupPhoto?.length > 0) {
      formData.append("groupPhoto", data.groupPhoto[0]);
    } else {
      toast.error("Group photo is required!");
      return;
    }
    console.log(formData);

    try {
      const response = await createGroup(formData);
      if ("data" in response) {
        toast.success("Group created successfully!");
        socket?.send(
          JSON.stringify({
            type: "group-conversation",
          })
        );
        reset();
        setGroupModalOpen(false);
      } else {
        toast.error("Failed to create group");
      }
    } catch (error) {
      toast.error("Group creation failed!");
    }
  };

  return (
    <div className="w-80 flex flex-col gap-4">
      {/* Header */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Chats</h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5 text-[#817F9B]" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#817F9B]" />
          <Input
            placeholder="Search message"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 border border-[#E1E5F3] outline-none placeholder:text-xs placeholder:text-[#817F9B]"
          />
        </div>
      </div>

      {/* Chat Lists */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Personal Messages */}
        <div>
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-[#817F9B] uppercase">
            Personal Messages
          </h2>
          {filteredMemberConversations.length > 0 ? (
            filteredMemberConversations.map((conv) => (
              <div
                key={conv.roomId}
                onClick={() => {
                  setSelectedChat(conv as MemberConversation);
                  const receiverId = conv?.partner?.id;
                  if (
                    socket &&
                    socket.readyState === WebSocket.OPEN &&
                    receiverId
                  ) {
                    socket.send(
                      JSON.stringify({
                        type: "member-subscribe",
                        receiverId,
                      })
                    );
                  }
                }}
                className="flex items-center gap-3 px-4 py-4 hover:bg-[#00A8CC1A] cursor-pointer transition-colors"
              >
                <div className="relative flex items-center space-x-2">
                  <div className="relative flex items-center space-x-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      {conv.partner?.profileImage && (
                        <Image
                          src={conv.partner.profileImage}
                          alt="avatar"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {conv.partner?.isActive && (
                      <span className="absolute bottom-[-1px] left-[28px] w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {conv?.partner?.fullName || "Unknown User"}
                      </h3>
                      <p className="text-xs text-[#817F9B] font-bold truncate overflow-hidden  w-full">
                        {conv?.lastMessage?.content?.substring(0, 15) ||
                          "No messages yet"}
                        ...
                      </p>
                    </div>
                    <span className="text-[10px] text-[#817F9B] flex flex-col items-center gap-1 min-w-[50px] text-right">
                      <span>
                        {conv?.lastMessage?.createdAt
                          ? formatChatDate(conv?.lastMessage?.createdAt)
                          : "Date"}
                      </span>
                      <span>{conv?.unreadCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-2 text-sm text-[#817F9B]">
              No matching personal chats found
            </p>
          )}
        </div>

        {/* Group Messages */}
        <hr />
        <div>
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-[#817F9B] uppercase">
            Group Messages
          </h2>
          {filteredGroupConversations.length > 0 ? (
            filteredGroupConversations.map((group) => (
              <div
                key={group.roomId}
                onClick={() => {
                  setSelectedGroupChat(group as GroupConversation);

                  socket?.send(
                    JSON.stringify({
                      type: "group-subscribe",
                      incomingGroupId: group?.roomId,
                    })
                  );
                }}
                className="flex items-center gap-3 px-4 py-4 hover:bg-[#00A8CC1A] cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-200">
                  {group?.groupPhoto && (
                    <Image
                      src={group?.groupPhoto}
                      alt="group-avatar"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {group?.groupName || "Unnamed Group"}
                      </h3>
                      <p className="text-xs text-[#817F9B] font-bold overflow-hidden whitespace-nowrap truncate w-full">
                        {group?.lastMessage?.content?.substring(0, 15) ||
                          "No messages yet"}
                        ...
                      </p>
                    </div>

                    <span className="text-[10px] text-[#817F9B] flex flex-col items-center gap-1 min-w-[60px] text-right">
                      <span className="w-full">
                        {group?.lastMessage?.createdAt
                          ? formatChatDate(group?.lastMessage?.createdAt)
                          : "Date"}
                      </span>
                      <span>{group?.unreadCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-2 text-sm text-[#817F9B]">
              No matching group chats found
            </p>
          )}
        </div>
      </div>
      <Modal
        title="Select Option"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="flex flex-col gap-4">
          {(authState.role === "Leader" || authState.role === "Admin") && (
            <>
              <Buttons type="primary" block onClick={handleCreateGroup}>
                Create Group
              </Buttons>
            </>
          )}

          <Buttons type="default" block onClick={handleSearchUser}>
            Search User
          </Buttons>
        </div>
      </Modal>

      <Modal
        title="Create Group"
        open={groupModalOpen}
        onCancel={() => setGroupModalOpen(false)}
        footer={null}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          <input
            type="text"
            placeholder="Group Name"
            {...register("groupName", { required: true })}
            className="border p-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            {...register("groupPhoto", { required: true })}
            className="border p-2 rounded"
          />

          <Button type="submit" className="bg-blue-500" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

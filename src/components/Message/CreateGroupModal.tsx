// "use Client"
import React from "react";

type CreateGroupModalProps = {
  isOpen: boolean;
  groupName: string;
  setGroupName: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
};

export default function CreateGroupModal({
  isOpen,
  groupName,
  setGroupName,
  onClose,
  onCreate,
}: CreateGroupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-md p-6 w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create Group</h2>
        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              onClose();
              setGroupName("");
            }}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCreate();
              setGroupName("");
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

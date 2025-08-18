import React from "react";

export const Loading = () => {
  return (
    <div>
      <div className="flex items-center justify-center min-h-[70vh] bg-white">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 rounded-full animate-pulse bg-[#00A8CC] dark:bg-[#00A8CC]"></div>
          <div className="w-8 h-8 rounded-full animate-pulse bg-[#00A8CC] dark:bg-[#00A8CC]"></div>
          <div className="w-8 h-8 rounded-full animate-pulse bg-[#00A8CC] dark:bg-[#00A8CC]"></div>
        </div>
      </div>
    </div>
  );
}
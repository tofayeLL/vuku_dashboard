/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title?: string | React.ReactNode; // Allow both string and JSX
  titleClass?: string; // Add this line
  submitText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  overlayClass?: string;
  modalClass?: string;
  headerClass?: string;
  footerClass?: string;
  showFooter?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Modal Title",
  submitText = "Submit",
  cancelText = "Cancel",
  children,
  size = "md",
  overlayClass = "",
  modalClass = "",
  headerClass = "",
  footerClass = "",
  showFooter = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-3xl",
    xl: "max-w-xl",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClass}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto ${modalClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6  ${headerClass}`}
        >
          <h2 className="text-3xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children || (
            <div className="space-y-4">
              <p>Modal content goes here</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {showFooter && (
          <div
            className={`flex items-center justify-end space-x-3 p-6 border-t border-gray-100 ${footerClass}`}
          >
            <button
              onClick={onClose}
              className="px-6 py-2 border cursor-pointer border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium bg-transparent transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onSubmit}
              className="px-6 py-2 bg-[#12AEC5] hover:bg-[#12AEC5] text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
              {submitText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Example Usage with your Training Form
interface TrainingFormData {
  trainingType: string;
  headingTitle: string;
  details: string;
  uploadedFile: File | null;
  titleClass?: string;
}

export const TrainingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TrainingFormData) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<TrainingFormData>({
    trainingType: "Banner",
    headingTitle: "How to Get Out Safely",
    details: "Comprehensive training on handling emergencies.",
    uploadedFile: null,
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reset form function
  const resetForm = () => {
    setFormData({
      trainingType: "Banner",
      headingTitle: "How to Get Out Safely",
      details: "Comprehensive training on handling emergencies.",
      uploadedFile: null,
    });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleInputChange = (field: keyof TrainingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({ ...prev, uploadedFile: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      setFormData((prev) => ({ ...prev, uploadedFile: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = () => {
    console.log("Form Data:", {
      trainingType: formData.trainingType,
      headingTitle: formData.headingTitle,
      details: formData.details,
      uploadedFile: formData.uploadedFile
        ? {
            name: formData.uploadedFile.name,
            type: formData.uploadedFile.type,
            size: formData.uploadedFile.size,
          }
        : null,
    });

    // Call the onSubmit prop with the form data
    onSubmit(formData);

    // Reset the form but don't close the modal
    resetForm();

    // Don't call onClose() here - modal stays open
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose} // This will only be called when clicking X or cancel
      onSubmit={handleSubmit}
      title="Create Training"
      submitText="Upload"
      size="lg"
    >
      <div className="space-y-6">
        {/* Training Type */}
        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-900">
            Training Type
          </label>
          <input
            value={formData.trainingType}
            onChange={(e) => handleInputChange("trainingType", e.target.value)}
            className="w-full px-3 py-2 text-gray-600 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter training type"
          />
        </div>

        {/* Heading Title */}
        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-900">
            Heading Title
          </label>
          <input
            value={formData.headingTitle}
            onChange={(e) => handleInputChange("headingTitle", e.target.value)}
            className="w-full px-3 py-2 text-gray-600 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter heading title"
          />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-900">
            Details
          </label>
          <textarea
            value={formData.details}
            onChange={(e) => handleInputChange("details", e.target.value)}
            className="w-full px-3 py-2 border text-gray-600 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
            placeholder="Enter training details"
          />
        </div>

        {/* File Upload with Preview */}
        <div className="space-y-2">
          <label className="block text-base font-medium text-gray-900">
            Uploaded File
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-[#12AEC5] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="flex flex-col items-center gap-4">
                {formData.uploadedFile?.type.startsWith("image/") ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="rounded-lg object-contain"
                      unoptimized // Required for blob URLs
                    />
                  </div>
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-48 rounded-lg object-contain"
                  />
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setFormData((prev) => ({ ...prev, uploadedFile: null }));
                    }}
                    className="px-3 py-1 text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                  <span className="text-sm text-gray-500">
                    {formData.uploadedFile?.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-start items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>
                <div className="space-y-5">
                  <p className="text-sm text-gray-600">
                    Please Upload Photo or Video
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-[#12AEC5] hover:bg-[#12AEC5] text-white rounded-lg text-sm font-medium">
                        Choose File
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      No file selected
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAdminMutation } from "@/redux/api/adminApi";

import { Eye, EyeOff, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "sonner";

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
    lg: "max-w-xl",
    xl: "max-w-xl",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClass}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} max-h-[100vh] overflow-y-auto ${modalClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 pt-4 ${headerClass}`}
        >
          <h2></h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6">
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

// Then define your AdminModal component
interface RegisterFormData {
  adminName: string;
  email: string;
  phone: string;
  password: string;
  /*  confirmPassword: string; */
}

const AdminModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegisterFormData) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    adminName: "",
    email: "",
    phone: "",
    password: "",
    /*     confirmPassword: "", */
  });

  const [registerAdmin] = useCreateAdminMutation();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    setFormData({
      adminName: "",
      email: "",
      phone: "",
      password: "",
      // confirmPassword: "",
    });
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Registration data:", formData);
      onSubmit(formData); 

      const adminData = {
        adminName: formData.adminName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      const res = await registerAdmin(adminData).unwrap();
      console.log("Add admin response:", res);

      toast.success("Admin added successfully");

      resetForm();
    } catch (error: any) {
      console.error("Admin registration failed:", error);

      resetForm();

      if (error.data) {
        toast.error(error.data.message || "Registration failed");
      } else if (error.status === 409) {
        toast.error("Admin with this email already exists");
      } else if (error.status === 400) {
        toast.error("Invalid input data");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Login"
      submitText="Login"
      size="lg"
      showFooter={false} // Since we have our own submit button in the form
    >
      <div className=" space-y-6 lg:my-8 my-4 lg:px-0 px-4">
        <div className="text-start">
          <h2 className="text-3xl font-bold text-[#1C2634]">Register</h2>
          <p className="lg:mt-3 mt-2 text-[#6C7278] font-medium">
            {"Let's login into your account first"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-gray-600">
              Your name
            </Label>
            <Input
              id="adminName"
              type="text"
              placeholder="Yourname"
              value={formData.adminName}
              onChange={(e) => handleInputChange("adminName", e.target.value)}
              className="h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-600">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="yourname@gmail.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm text-gray-600">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(+12)435-1213-232"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-gray-600">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="*******"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/*   <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm text-gray-600">
              Repeat Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="*******"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div> */}

          <Button
            type="submit"
            className="w-full h-12 text-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium mt-6"
          >
            Register
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  router.push("/login");
                }}
                className="text-cyan-500 hover:text-cyan-600 font-medium"
              >
                Login Here
              </button>
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AdminModal;

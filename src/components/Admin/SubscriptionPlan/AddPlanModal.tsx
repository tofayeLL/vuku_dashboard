"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface FormData {
  planName: string;
  pricePerMonth: string;
  duration: string;
  ideal: string;
  bookAccess: string;
  features: string[];
}

const AddPlanModal = ({ isOpen, onClose }: AddPlanModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    planName: "subscription",
    pricePerMonth: "4.99",
    duration: "1 month",
    ideal: "Light users",
    bookAccess: "20-25",
    features: ["All core features, quizzes, gamification."],
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-[30%]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold"></DialogTitle>
        </DialogHeader>

        <Card className="w-full">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Add Subscription Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Plan Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="planName"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Plan Name*
                </Label>
                <Input
                  id="planName"
                  placeholder="Type Plan Name"
                  value={formData.planName}
                  onChange={(e) =>
                    handleInputChange("planName", e.target.value)
                  }
                  className="w-full"
                  required
                />
              </div>

              {/* Price Per Month */}
              <div className="space-y-2">
                <Label
                  htmlFor="pricePerMonth"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Price Per Month*
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="pricePerMonth"
                    type="number"
                    placeholder="Price Per Month"
                    step="0.01"
                    value={formData.pricePerMonth}
                    onChange={(e) =>
                      handleInputChange("pricePerMonth", e.target.value)
                    }
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2 w-full">
                {" "}
                {/* Add w-full here */}
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Duration*
                </Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) =>
                    handleInputChange("duration", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    {" "}
                    {/* Add w-full here */}
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="12 months">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ideal */}
              <div className="space-y-2 w-full">
                <Label
                  htmlFor="ideal"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Ideal*
                </Label>
                <Select
                  value={formData.ideal}
                  onValueChange={(value) => handleInputChange("ideal", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Light users">Light users</SelectItem>
                    <SelectItem value="Regular users">Regular users</SelectItem>
                    <SelectItem value="Power users">Power users</SelectItem>
                    <SelectItem value="Enterprise users">
                      Enterprise users
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Book Access */}
              <div className="space-y-2">
                <Label
                  htmlFor="bookAccess"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Book Access*
                </Label>
                <Input
                  id="bookAccess"
                  value={formData.bookAccess}
                  placeholder="Book Access"
                  onChange={(e) =>
                    handleInputChange("bookAccess", e.target.value)
                  }
                  className="w-full"
                  required
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Features*
                </Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <Textarea
                      key={index}
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder="Enter feature description"
                      className="min-h-[80px] resize-none"
                      required
                    />
                  ))}

                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFeature}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                      Add More
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-6 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlanModal;

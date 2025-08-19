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
import { useCreatePlanMutation } from "@/redux/api/planApi";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  planName: string;
  price: string;
  interval: string;
  intervalCount: string;
  ideal: string;
  accessBooks: string;
  features: string[];
}

const AddPlanModal = ({ isOpen, onClose }: AddPlanModalProps) => {
  const [createPlan] = useCreatePlanMutation();

  const [formData, setFormData] = useState<FormData>({
    planName: "",
    price: "",
    interval: "",
    intervalCount: "",
    ideal: "",
    accessBooks: "",
    features: [""],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Transform data to match backend structure
    const planData = {
      planName: formData.planName,
      price: parseFloat(formData.price),
      interval: formData.interval,
      intervalCount: parseInt(formData.intervalCount),
      ideal: formData.ideal,
      accessBooks: formData.accessBooks,
      features: formData.features
        .filter((feature) => feature.trim() !== "")
        .flatMap((feature) =>
          feature
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f !== "")
        ),
    };

    console.log("Form submitted (backend format):", planData);
    // Here you would send backendData to your API

    const res = await createPlan(planData).unwrap();
    console.log("create  plan", res);
    // Reset form after successful submission
    setFormData({
      planName: "",
      price: "",
      interval: "",
      intervalCount: "",
      ideal: "",
      accessBooks: "",
      features: [""],
    });
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

              {/* Price */}
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Price*
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              {/* Interval */}
              <div className="space-y-2 w-full">
                <Label
                  htmlFor="interval"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Interval*
                </Label>
                <Select
                  value={formData.interval}
                  onValueChange={(value) =>
                    handleInputChange("interval", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interval Count */}
              <div className="space-y-2">
                <Label
                  htmlFor="intervalCount"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Interval Count*
                </Label>
                <Input
                  id="intervalCount"
                  type="number"
                  placeholder="Interval Count (e.g., 1, 3, 6)"
                  min="1"
                  value={formData.intervalCount}
                  onChange={(e) =>
                    handleInputChange("intervalCount", e.target.value)
                  }
                  className="w-full"
                  required
                />
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

              {/* Access Books */}
              <div className="space-y-2">
                <Label
                  htmlFor="accessBooks"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Access Books*
                </Label>
                <Input
                  id="accessBooks"
                  value={formData.accessBooks}
                  placeholder="Book Access (e.g., All available books, 20-25)"
                  onChange={(e) =>
                    handleInputChange("accessBooks", e.target.value)
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

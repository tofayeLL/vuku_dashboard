"use client";

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";


import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface QuizFormData {
  bookName: string
  questionNumber: string
  questionName: string
  questionAnswerA: string
  questionAnswerB: string
  questionAnswerC: string
  questionAnswerD: string
  correctAnswerDetails: string
  correctAnswerNo: string
}

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const  CreateQuizModal= ({ isOpen, onClose }: CreateQuizModalProps) => {
  const [formData, setFormData] = useState<QuizFormData>({
    bookName: "",
    questionNumber: "",
    questionName: "",
    questionAnswerA: "",
    questionAnswerB: "",
    questionAnswerC: "",
    questionAnswerD: "",
    correctAnswerDetails: "",
    correctAnswerNo: "",
  })

  const handleInputChange = (field: keyof QuizFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data:", formData)
    console.log("Book Name:", formData.bookName)
    console.log("Question Number:", formData.questionNumber)
    console.log("Question Name:", formData.questionName)
    console.log("Question Answer A:", formData.questionAnswerA)
    console.log("Question Answer B:", formData.questionAnswerB)
    console.log("Question Answer C:", formData.questionAnswerC)
    console.log("Question Answer D:", formData.questionAnswerD)
    console.log("Correct Answer Details:", formData.correctAnswerDetails)
    console.log("Correct Answer No:", formData.correctAnswerNo)
  }

  const handleCancel = () => {
    setFormData({
      bookName: "",
      questionNumber: "",
      questionName: "",
      questionAnswerA: "",
      questionAnswerB: "",
      questionAnswerC: "",
      questionAnswerD: "",
      correctAnswerDetails: "",
      correctAnswerNo: "",
    })
  }

  const handleAddMore = () => {
    console.log("Add More clicked - Current form data:", formData)
    // You can implement additional logic here for adding more questions
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[40%]">

         {/* Add close button in the corner */}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>



        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        
         <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Add Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Name */}
          <div className="space-y-2">
            <Label htmlFor="bookName" className="text-sm font-medium text-gray-700">
              Book Name*
            </Label>
            <Input
              id="bookName"
              type="text"
              placeholder="Search by Title"
              value={formData.bookName}
              onChange={(e) => handleInputChange("bookName", e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Question Number */}
          <div className="space-y-2">
            <Label htmlFor="questionNumber" className="text-sm font-medium text-gray-700">
              Question Number*
            </Label>
            <Input
              id="questionNumber"
              type="text"
              placeholder="Question number"
              value={formData.questionNumber}
              onChange={(e) => handleInputChange("questionNumber", e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Question Name */}
          <div className="space-y-2">
            <Label htmlFor="questionName" className="text-sm font-medium text-gray-700">
              Question Name*
            </Label>
            <Textarea
              id="questionName"
              placeholder="What is the main theme of the story?"
              value={formData.questionName}
              onChange={(e) => handleInputChange("questionName", e.target.value)}
              className="w-full min-h-[100px] resize-none"
              required
            />
          </div>

          {/* Answer Options A & B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="questionAnswerA" className="text-sm font-medium text-gray-700">
                Question Answer(A)*
              </Label>
              <Input
                id="questionAnswerA"
                type="text"
                placeholder="Friendship"
                value={formData.questionAnswerA}
                onChange={(e) => handleInputChange("questionAnswerA", e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionAnswerB" className="text-sm font-medium text-gray-700">
                Question Answer(B)*
              </Label>
              <Input
                id="questionAnswerB"
                type="text"
                placeholder="Adventure"
                value={formData.questionAnswerB}
                onChange={(e) => handleInputChange("questionAnswerB", e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Answer Options C & D */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="questionAnswerC" className="text-sm font-medium text-gray-700">
                Question Answer(C)*
              </Label>
              <Input
                id="questionAnswerC"
                type="text"
                placeholder="Discovery"
                value={formData.questionAnswerC}
                onChange={(e) => handleInputChange("questionAnswerC", e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionAnswerD" className="text-sm font-medium text-gray-700">
                Question Answer(D)*
              </Label>
              <Input
                id="questionAnswerD"
                type="text"
                placeholder="Loss"
                value={formData.questionAnswerD}
                onChange={(e) => handleInputChange("questionAnswerD", e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Correct Answer Details & Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="correctAnswerDetails" className="text-sm font-medium text-gray-700">
                Correct Answer (Details)*
              </Label>
              <Input
                id="correctAnswerDetails"
                type="text"
                placeholder="Discovery"
                value={formData.correctAnswerDetails}
                onChange={(e) => handleInputChange("correctAnswerDetails", e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correctAnswerNo" className="text-sm font-medium text-gray-700">
                Correct Answer No.*
              </Label>
              <Input
                id="correctAnswerNo"
                type="text"
                placeholder="C"
                value={formData.correctAnswerNo}
                onChange={(e) => handleInputChange("correctAnswerNo", e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Add More Button */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddMore}
              className="flex items-center gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Add More
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="px-8 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="px-8 bg-green-600 hover:bg-green-700">
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

export default CreateQuizModal;
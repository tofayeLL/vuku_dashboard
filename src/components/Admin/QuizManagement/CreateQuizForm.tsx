/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  useCreateQuizMutation,
  useGetSingleBookQuery,
} from "@/redux/api/quizApi";
import { toast } from "sonner";

interface BookResult {
  nid: number;
  title: string;
  [key: string]: any;
}

interface QuizFormData {
  bookName: string;
  bookId: number | null;
  content: string;
  questionAnswerA: string;
  questionAnswerB: string;
  questionAnswerC: string;
  questionAnswerD: string;
  correctAnswers: string[];
}

interface QuestionFormData {
  content: string;
  questionAnswerA: string;
  questionAnswerB: string;
  questionAnswerC: string;
  questionAnswerD: string;
  correctAnswers: string[];
}

const CreateQuizPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [createQuiz] = useCreateQuizMutation();

  // Debounce implementation
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        setDebouncedQuery(searchQuery);
      }, 1000);
    } else {
      setDebouncedQuery("");
      setShowDropdown(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const { data: bookResults, isLoading } = useGetSingleBookQuery(
    { title: debouncedQuery },
    { skip: debouncedQuery.trim() === "" }
  );

  const [formData, setFormData] = useState<QuizFormData>({
    bookName: "",
    bookId: null,
    content: "",
    questionAnswerA: "",
    questionAnswerB: "",
    questionAnswerC: "",
    questionAnswerD: "",
    correctAnswers: [],
  });

  const [additionalForms, setAdditionalForms] = useState<QuestionFormData[]>(
    []
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBookSelect = (book: BookResult) => {
    setFormData((prev) => ({
      ...prev,
      bookName: book.title,
      bookId: book.nid,
    }));
    setSearchQuery(book.title);
    setShowDropdown(false);
  };

  const handleBookNameChange = (value: string) => {
    setSearchQuery(value);
    setFormData((prev) => ({
      ...prev,
      bookName: value,
      bookId: value === "" ? null : prev.bookId,
    }));
    setShowDropdown(value.trim().length >= 2);
  };

  // Helper function to get the actual answer text based on option letter
  const getAnswerValue = (
    option: string,
    formData: QuizFormData | QuestionFormData
  ): string => {
    switch (option) {
      case "A":
        return formData.questionAnswerA;
      case "B":
        return formData.questionAnswerB;
      case "C":
        return formData.questionAnswerC;
      case "D":
        return formData.questionAnswerD;
      default:
        return "";
    }
  };

  /*  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookId) {
      alert("Please select a book from the dropdown");
      return;
    }
    
    // Prepare main question - convert option letters to actual answer values
    const mainQuestion = {
      content: formData.content,
      options: [
        formData.questionAnswerA,
        formData.questionAnswerB,
        formData.questionAnswerC,
        formData.questionAnswerD,
      ].filter(option => option.trim() !== ""), // Filter out empty options
      correctAnswers: formData.correctAnswers
        .map(option => getAnswerValue(option, formData))
        .filter(ans => ans.trim() !== ""),
    };

    // Prepare additional questions - convert option letters to actual answer values
    const additionalQuestions = additionalForms.map(form => ({
      content: form.content,
      options: [
        form.questionAnswerA,
        form.questionAnswerB,
        form.questionAnswerC,
        form.questionAnswerD,
      ].filter(option => option.trim() !== ""),
      correctAnswers: form.correctAnswers
        .map(option => getAnswerValue(option, form))
        .filter(ans => ans.trim() !== ""),
    }));

    // Combine all questions with auto-generated numbers
    const allQuestions = [mainQuestion, ...additionalQuestions].map((q, i) => ({
      questionNo: i + 1, // Auto-generated question number starting from 1
      ...q
    }));

    const submissionData = {
      bookId: formData.bookId,
      bookName: formData.bookName,
      questions: allQuestions
    };
    
    console.log("Form Data:", submissionData);
    // Here you would typically send submissionData to your backend
    const res = await createQuiz(submissionData).unwrap();
    console.log("submit quiz",res);
  }; */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookId) {
      alert("Please select a book from the dropdown");
      return;
    }

    try {
      // Prepare main question - convert option letters to actual answer values
      const mainQuestion = {
        content: formData.content,
        options: [
          formData.questionAnswerA,
          formData.questionAnswerB,
          formData.questionAnswerC,
          formData.questionAnswerD,
        ].filter((option) => option.trim() !== ""), // Filter out empty options
        correctAnswers: formData.correctAnswers
          .map((option) => getAnswerValue(option, formData))
          .filter((ans) => ans.trim() !== ""),
      };

      // Prepare additional questions - convert option letters to actual answer values
      const additionalQuestions = additionalForms.map((form) => ({
        content: form.content,
        options: [
          form.questionAnswerA,
          form.questionAnswerB,
          form.questionAnswerC,
          form.questionAnswerD,
        ].filter((option) => option.trim() !== ""),
        correctAnswers: form.correctAnswers
          .map((option) => getAnswerValue(option, form))
          .filter((ans) => ans.trim() !== ""),
      }));

      // Combine all questions with auto-generated numbers
      const allQuestions = [mainQuestion, ...additionalQuestions].map(
        (q, i) => ({
          questionNo: i + 1, // Auto-generated question number starting from 1
          ...q,
        })
      );

      const submissionData = {
        bookId: formData.bookId,
        bookName: formData.bookName,
        questions: allQuestions,
      };

      console.log("Form Data:", submissionData);

      const res = await createQuiz(submissionData).unwrap();
      console.log("submit quiz", res);

      // Show success toast
      toast.success("Quiz submitted successfully!");

      // Reset form after successful submission
      setFormData({
        bookName: "",
        bookId: null,
        content: "",
        questionAnswerA: "",
        questionAnswerB: "",
        questionAnswerC: "",
        questionAnswerD: "",
        correctAnswers: [],
      });
      setAdditionalForms([]);
      setSearchQuery("");
    } catch (error: any) {
      console.error("Error creating quiz:", error);

      // Show error toast with specific message if available
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to create quiz. Please try again.";
      toast.error(errorMessage);
    }
  };
  const handleInputChange = (
    field: keyof Omit<QuizFormData, "bookName" | "bookId">,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdditionalFormChange = (
    index: number,
    field: keyof QuestionFormData,
    value: string | string[]
  ) => {
    setAdditionalForms((prev) =>
      prev.map((form, i) => (i === index ? { ...form, [field]: value } : form))
    );
  };

  const handleAddMore = () => {
    setAdditionalForms((prev) => [
      ...prev,
      {
        content: "",
        questionAnswerA: "",
        questionAnswerB: "",
        questionAnswerC: "",
        questionAnswerD: "",
        correctAnswers: [],
      },
    ]);
  };

  const removeForm = (index: number) => {
    setAdditionalForms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCorrectAnswerChange = (value: string, isChecked: boolean) => {
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          correctAnswers: [...prev.correctAnswers, value],
        };
      } else {
        return {
          ...prev,
          correctAnswers: prev.correctAnswers.filter((ans) => ans !== value),
        };
      }
    });
  };

  const handleAdditionalCorrectAnswerChange = (
    index: number,
    value: string,
    isChecked: boolean
  ) => {
    setAdditionalForms((prev) =>
      prev.map((form, i) => {
        if (i === index) {
          if (isChecked) {
            return {
              ...form,
              correctAnswers: [...form.correctAnswers, value],
            };
          } else {
            return {
              ...form,
              correctAnswers: form.correctAnswers.filter(
                (ans) => ans !== value
              ),
            };
          }
        }
        return form;
      })
    );
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">Add Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Book Name with Dropdown */}
        <div className="space-y-2 relative" ref={dropdownRef}>
          <Label
            htmlFor="bookName"
            className="text-sm font-medium text-gray-700"
          >
            Book Name*
          </Label>
          <Input
            id="bookName"
            type="text"
            placeholder="Type at least 2 characters to search"
            value={formData.bookName}
            onChange={(e) => handleBookNameChange(e.target.value)}
            className="w-full"
            required
            onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
          />

          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto border border-gray-200">
              {isLoading ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Loading...
                </div>
              ) : bookResults?.result?.length > 0 ? (
                bookResults.result
                  .filter((book: BookResult) => typeof book === "object")
                  .map((book: BookResult) => (
                    <div
                      key={book?.nid}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleBookSelect(book)}
                    >
                      {book?.title}
                    </div>
                  ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  {searchQuery.length < 2
                    ? "Type at least 2 characters to search"
                    : "No books found"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Question Content */}
          <div className="space-y-2">
            <Label
              htmlFor="content"
              className="text-sm font-medium text-gray-700"
            >
              Question 1*
            </Label>
            <Textarea
              id="content"
              placeholder="Enter your question here"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className="w-full min-h-[100px] resize-none"
              required
            />
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["A", "B", "C", "D"].map((option) => (
              <div className="space-y-2" key={option}>
                <Label className="text-sm font-medium text-gray-700">
                  Option {option}*
                </Label>
                <Input
                  type="text"
                  placeholder={`Option ${option}`}
                  value={
                    formData[
                      `questionAnswer${option}` as keyof QuizFormData
                    ] as string
                  }
                  onChange={(e) =>
                    handleInputChange(
                      `questionAnswer${option}` as keyof Omit<
                        QuizFormData,
                        "bookName" | "bookId"
                      >,
                      e.target.value
                    )
                  }
                  className="w-full"
                  required
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`correct-${option}`}
                    checked={formData.correctAnswers.includes(option)}
                    onChange={(e) =>
                      handleCorrectAnswerChange(option, e.target.checked)
                    }
                    className="mr-2"
                  />
                  <Label htmlFor={`correct-${option}`}>Correct Answer</Label>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Forms */}
          {additionalForms.map((form, index) => (
            <div key={index} className="border-t pt-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Question {index + 2}</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeForm(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>

              {/* Question Content */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Question *
                </Label>
                <Textarea
                  placeholder="Enter your question here"
                  value={form.content}
                  onChange={(e) =>
                    handleAdditionalFormChange(index, "content", e.target.value)
                  }
                  className="w-full min-h-[100px] resize-none"
                  required
                />
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {["A", "B", "C", "D"].map((option) => (
                  <div className="space-y-2" key={option}>
                    <Label className="text-sm font-medium text-gray-700">
                      Option {option}*
                    </Label>
                    <Input
                      type="text"
                      placeholder={`Option ${option}`}
                      value={
                        form[
                          `questionAnswer${option}` as keyof QuestionFormData
                        ] as string
                      }
                      onChange={(e) =>
                        handleAdditionalFormChange(
                          index,
                          `questionAnswer${option}` as keyof QuestionFormData,
                          e.target.value
                        )
                      }
                      className="w-full"
                      required
                    />
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`correct-${index}-${option}`}
                        checked={form.correctAnswers.includes(option)}
                        onChange={(e) =>
                          handleAdditionalCorrectAnswerChange(
                            index,
                            option,
                            e.target.checked
                          )
                        }
                        className="mr-2"
                      />
                      <Label htmlFor={`correct-${index}-${option}`}>
                        Correct Answer
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

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

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="px-8 bg-green-600 hover:bg-green-700"
            >
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateQuizPage;

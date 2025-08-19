/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useGetSingleBookQuery } from "@/redux/api/quizApi";

interface BookResult {
  nid: number;
  title: string;
  [key: string]: any;
}

interface QuizFormData {
  bookName: string;
  bookId: number | null;
  questionNumber: string;
  questionName: string;
  questionAnswerA: string;
  questionAnswerB: string;
  questionAnswerC: string;
  questionAnswerD: string;
  correctAnswerDetails: string;
  correctAnswerNo: string;
}



const CreateQuizPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce implementation
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only search if query has at least 2 characters
    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        setDebouncedQuery(searchQuery);
      }, 1000); // 500ms delay after typing stops
    } else {
      setDebouncedQuery(""); // Clear results if query is too short
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
    questionNumber: "",
    questionName: "",
    questionAnswerA: "",
    questionAnswerB: "",
    questionAnswerC: "",
    questionAnswerD: "",
    correctAnswerDetails: "",
    correctAnswerNo: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookId) {
      alert("Please select a book from the dropdown");
      return;
    }
    console.log("Form Data:", formData);
    console.log("Selected Book NID:", formData.bookId);
  };

  const handleInputChange = (field: keyof QuizFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };



  const handleAddMore = () => {
    console.log("Add More clicked - Current form data:", formData);
  };

  return (
    

        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Add Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            {/*  <form onSubmit={handleSubmit} className="space-y-6"> */}
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

              {/* Dropdown with search results */}
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
            {/* Form for quiz questions */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="questionNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Question Number*
                </Label>
                <Input
                  id="questionNumber"
                  type="text"
                  placeholder="Question number"
                  value={formData.questionNumber}
                  onChange={(e) =>
                    handleInputChange("questionNumber", e.target.value)
                  }
                  className="w-full"
                  required
                />
              </div>

              {/* Question Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="questionName"
                  className="text-sm font-medium text-gray-700"
                >
                  Question Name*
                </Label>
                <Textarea
                  id="questionName"
                  placeholder="What is the main theme of the story?"
                  value={formData.questionName}
                  onChange={(e) =>
                    handleInputChange("questionName", e.target.value)
                  }
                  className="w-full min-h-[100px] resize-none"
                  required
                />
              </div>

              {/* Answer Options A & B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="questionAnswerA"
                    className="text-sm font-medium text-gray-700"
                  >
                    Question Answer(A)*
                  </Label>
                  <Input
                    id="questionAnswerA"
                    type="text"
                    placeholder="Friendship"
                    value={formData.questionAnswerA}
                    onChange={(e) =>
                      handleInputChange("questionAnswerA", e.target.value)
                    }
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="questionAnswerB"
                    className="text-sm font-medium text-gray-700"
                  >
                    Question Answer(B)*
                  </Label>
                  <Input
                    id="questionAnswerB"
                    type="text"
                    placeholder="Adventure"
                    value={formData.questionAnswerB}
                    onChange={(e) =>
                      handleInputChange("questionAnswerB", e.target.value)
                    }
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Answer Options C & D */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="questionAnswerC"
                    className="text-sm font-medium text-gray-700"
                  >
                    Question Answer(C)*
                  </Label>
                  <Input
                    id="questionAnswerC"
                    type="text"
                    placeholder="Discovery"
                    value={formData.questionAnswerC}
                    onChange={(e) =>
                      handleInputChange("questionAnswerC", e.target.value)
                    }
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="questionAnswerD"
                    className="text-sm font-medium text-gray-700"
                  >
                    Question Answer(D)*
                  </Label>
                  <Input
                    id="questionAnswerD"
                    type="text"
                    placeholder="Loss"
                    value={formData.questionAnswerD}
                    onChange={(e) =>
                      handleInputChange("questionAnswerD", e.target.value)
                    }
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Correct Answer Details & Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="correctAnswerDetails"
                    className="text-sm font-medium text-gray-700"
                  >
                    Correct Answer (Details)*
                  </Label>
                  <Input
                    id="correctAnswerDetails"
                    type="text"
                    placeholder="Discovery"
                    value={formData.correctAnswerDetails}
                    onChange={(e) =>
                      handleInputChange("correctAnswerDetails", e.target.value)
                    }
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="correctAnswerNo"
                    className="text-sm font-medium text-gray-700"
                  >
                    Correct Answer No.*
                  </Label>
                  <Input
                    id="correctAnswerNo"
                    type="text"
                    placeholder="C"
                    value={formData.correctAnswerNo}
                    onChange={(e) =>
                      handleInputChange("correctAnswerNo", e.target.value)
                    }
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
                <Button
                  type="button"
                  variant="outline"
               
                  className="px-8 bg-transparent"
                >
                  Cancel
                </Button>
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

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronRight, Plus, Users } from "lucide-react";
import React, { useState } from "react";
import CreateQuizModal from "./CreateQuizModal";
import { useGetAllQuizQuery } from "@/redux/api/quizApi";
import { Loading } from "@/components/ui/loading";

interface QuizManagement {
  title: string;
  questionCount: number;
  completionCount: number;
  onClick?: () => void;
}

const QuizManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {data:allQuizzes, isLoading} = useGetAllQuizQuery({});
  console.log("quiz page",allQuizzes?.result);


    if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-white">
        <div className="flex items-center justify-center space-x-2">
          <Loading></Loading>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">All Quizzes</h1>
        <p>Your recently created quizzes</p>
      </div>

      <div className="mt-5 grid lg:grid-cols-3 grid-cols-1 gap-6">
        {
          allQuizzes?.result?.map((item:any)=>(
            <Card key={item.id} className="w-full max-w-sm cursor-pointer bg-white transition-all duration-200 hover:shadow-md hover:bg-gray-50/50  shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium  text-black text-lg leading-tight">
               {item?.bookName}
              </h3>
              <ChevronRight className="h-5 w-5 text-gray-900 flex-shrink-0 ml-2 " />
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>{item?._count?.question} questions</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{item?.participateCount} completions</span>
              </div>
            </div>
          </CardContent>
        </Card>
          ))
        }
       
      </div>

      {/* for create quiz */}
      <div className="mt-6">
        <Card
          className="w-full max-w-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-dashed border-2 border-muted-foreground/20 bg-muted/10"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 ">
              <Plus className="h-7 w-7 text-[#54BB52]" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-foreground">
              Create New Quiz
            </h3>
            <p className="text-sm ">Add Quiz, set time limits and more</p>
          </CardContent>
        </Card>

        {/* Modal Component */}
        <CreateQuizModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default QuizManagement;

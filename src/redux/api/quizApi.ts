import { baseApi } from "./baseApi";

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuiz: builder.query({
      query: () => ({
        url: "/quizz",

        method: "GET",
      }),
      providesTags: ["quiz"],
    }),

    getSingleBook: builder.query({
      query: ({title}) => ({
        url: `/books/by-title?title=${title}`,
        method: "GET",
      }),
      providesTags: ["quiz"],
    }),
    
     createQuiz: builder.mutation({
      query: (formData) => ({
        url: `/quizz/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["quiz"],
    }),
   
  }),
});

export const { useGetAllQuizQuery, useGetSingleBookQuery , useCreateQuizMutation} = quizApi;

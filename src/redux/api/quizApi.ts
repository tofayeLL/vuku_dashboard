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

    getSingleUser: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["quiz"],
    }),
  }),
});

export const { useGetAllQuizQuery, useGetSingleUserQuery } = quizApi;

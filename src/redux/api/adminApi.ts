import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdminStats: builder.query({
      query: () => ({
        url: `/auth/admin-overview`,
        method: "GET",
      }),
      providesTags: ["admins"],
    }),
    getNewUser: builder.query({
      query: ({ filter }) => ({
        url: `/users/new/users?filter=${filter}`,
        method: "GET",
      }),
      providesTags: ["admins"],
    }),
  }),
});

export const { useGetAllAdminStatsQuery, useGetNewUserQuery } = adminApi;

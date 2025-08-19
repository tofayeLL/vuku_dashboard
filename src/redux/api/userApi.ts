import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
     getAllUsers: builder.query({
      query: ({ page, limit }) => ({
        url: `/users?page=${page}&limit=${limit}`,
       
        method: "GET",
      }),
      providesTags: ["users"],
    }),
   
    getSingleUser: builder.query({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
   
   
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  
} = userApi;
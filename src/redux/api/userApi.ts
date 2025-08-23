import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
     getAllUsers: builder.query({
      query: ({ page, limit, search }) => {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        // Add search parameter if provided
        if (search && search.trim() !== '') {
          params.append('search', search.trim());
        }
        
        return {
          url: `/users?${params.toString()}`,
          method: "GET",
        };
      },
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
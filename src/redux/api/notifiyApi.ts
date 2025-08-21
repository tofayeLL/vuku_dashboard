import { baseApi } from "./baseApi";

export const notifyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query({
      query: () => ({
        url: `/notifications/admin-notifications`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),
    updateNotification: builder.mutation({
      query: ( id ) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
        
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useDeleteNotificationMutation,
  useUpdateNotificationMutation,
} = notifyApi;

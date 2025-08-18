import { baseApi } from "./baseApi";

export const notifyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: () => ({
        url: `/notifications`,
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
      query: ({ id, data }) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useDeleteNotificationMutation,
  useUpdateNotificationMutation,
} = notifyApi;

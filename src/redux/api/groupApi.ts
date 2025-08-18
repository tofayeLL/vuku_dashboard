import { baseApi } from "./baseApi";

export const groupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (formData) => ({
        url: `/groups/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["group", "notifications"],
    }),

    inviteGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `/groups/invite-group/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["report", "users", "wardens", "leaders"],
    }),
  }),
});

export const { useCreateGroupMutation, useInviteGroupMutation } = groupApi;

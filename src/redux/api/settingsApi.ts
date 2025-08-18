import { baseApi } from "./baseApi";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyProfile: builder.query({
            query: () => ({
                url: `/auth/profile`,
                method: 'GET',
            }),
            providesTags: ['profile']
        }),
        updateMyProfile: builder.mutation({
            query: (body) => ({
                url: `/auth/profile`,
                method: 'PATCH',
                body: body
            }),
            invalidatesTags: ['profile']
        })
    }),
})

export const { useGetMyProfileQuery, useUpdateMyProfileMutation } = settingsApi;
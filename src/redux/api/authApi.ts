/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const AuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserByAdmin: builder.mutation({
      query: (body) => ({
        url: `/users/signup-verification`,
        method: "POST",
        body: body,
      }),
    }),
    login: builder.mutation({
      query: ({ body }) => ({
        url: `/admin/login`,
        method: "POST",
        body: body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data: { email: string }) => {
        return {
          url: "/auth/send-otp",
          method: "POST",
          body: data,
        };
      },
    }),
    otpUser: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/verify-otp",
          method: "POST",
          body: body,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (data: any) => {
        return {
          url: "/auth/reset-password",
          method: "PATCH",
          body: data,
        };
      },
    }),
    changePassword: builder.mutation({
      query: ({ body }) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body: body,
      }),
    }),
  }),
});

export const {
  useCreateUserByAdminMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useOtpUserMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = AuthApi;

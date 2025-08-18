import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

// const baseUrl = "http://localhost:4013/api/v1";
const baseUrl = "https://poojithatanjore-backend.vercel.app/api/v1";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.auth?.token;

      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "users",
    "wardens",
    "profile",
    "report",
    "admin",
    "leader",
    "warden",
    "uploadFile",
    "leaders",
    "notifications",
    "group",
    "admins"
  ],
});

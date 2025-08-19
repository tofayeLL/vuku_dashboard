import { baseApi } from "./baseApi";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
     createPlan: builder.mutation({
      query: (formData) => ({
        url: `/plans/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["plan"],
    }),
   
  }),
});

export const {  useCreatePlanMutation} = planApi;

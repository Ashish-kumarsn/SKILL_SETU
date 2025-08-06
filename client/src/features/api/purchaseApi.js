import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = `${import.meta.env.VITE_BASE_API_URL}/purchase`;

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include", // for sending cookies
  }),
  endpoints: (builder) => ({
    // 💳 Create Stripe Checkout Session
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId }, // backend expects { courseId }
      }),
    }),

    // 📥 Get Course Details With Purchase Status (used on course detail/progress page)
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),

    // 🎓 Get All Purchased Courses for logged-in user
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),

    // 📊 Get Instructor Sales & Revenue Stats
    getInstructorStats: builder.query({
      query: () => ({
        url: `/instructor-stats`,
        method: "GET",
      }),
    }),
    getInstructorEarnings: builder.query({
  query: () => ({
    url: "/instructor/earnings",
    method: "GET",
  }),
}),

  }),
});

// ✅ Export RTK hooks
export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
  useGetInstructorStatsQuery,
  useGetInstructorEarningsQuery,
} = purchaseApi;

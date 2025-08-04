import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture", "Refetch_Quiz"], // ✅ Added Refetch_Quiz
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({

    // ✅ Create new course
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    // ✅ Search courses
    getSearchCourse: builder.query({
      query: ({ searchQuery, categories, sortByPrice }) => {
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;

        if (categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }

        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }

        return {
          url: queryString,
          method: "GET",
        };
      },
    }),

    // ✅ Get all published courses
    getPublishedCourse: builder.query({
      query: () => ({
        url: "/published-courses",
        method: "GET",
      }),
    }),

    // ✅ Get creator's courses
    getCreatorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    // ✅ Edit a course
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    // ✅ Get a course by ID
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),

    // ✅ Create a new lecture
    createLecture: builder.mutation({
      query: ({ lectureTitle, chapter, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle, chapter }, // ✅ Include chapter
      }),
    }),


    // ✅ Get all lectures for a course
    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Lecture"],
    }),

    // ✅ Edit a lecture
    editLecture: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        courseId,
        lectureId,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "PUT",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
      invalidatesTags: ["Refetch_Lecture"], // ✅ Important for triggering refetch on lecture list
    }),


    // ✅ Delete a lecture
    removeLecture: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lecture"],
    }),


    // ✅ Get a single lecture by ID
    getLectureById: builder.query({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}`, // ✅ No extra 'course'
        method: "GET",
      }),
    }),



    // ✅ Publish or unpublish a course
    publishCourse: builder.mutation({
      query: ({ courseId, publish }) => ({
        url: `/${courseId}/publish?publish=${publish}`,
        method: "PUT",
      }),
    }),

    // ✅ Delete a course
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/admin/delete-course/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    // ✅ Upload PDF (🆕)
    uploadCoursePDF: builder.mutation({
      query: ({ courseId, formData }) => ({
        url: `/${courseId}/upload-pdf`,
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ Create a quiz (🆕)
// Correct version
createQuiz: builder.mutation({
  query: ({ courseId, quizData }) => ({
    url: `/${courseId}/create-quiz`,  // ✅ FIXED HERE
    method: "POST",
    body: quizData,
  }),
  invalidatesTags: ["Refetch_Quiz"],
}),



    // ✅ Get quizzes for a course (🆕)
    getCourseQuizzes: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/quiz`,
        method: "GET",
      }),
      providesTags: ["Refetch_Quiz"],
    }),

    // delete a quiz
    deleteQuiz: builder.mutation({
      query: ({ courseId, quizId }) => ({
        url: `/${courseId}/quiz/${quizId}`,
        method: "DELETE",
      }),
    }),

    // delete question from quiz
    deleteQuizQuestion: builder.mutation({
      query: ({ quizId, questionIndex }) => ({
        url: `/quiz/${quizId}/question/${questionIndex}`,
        method: "DELETE",
      }),
    }),

    //update/edit quiz
    updateQuiz: builder.mutation({
      query: ({ quizId, updatedData }) => ({
        url: `/quiz/${quizId}`,
        method: "PUT",
        body: updatedData,
      }),
    }),

    getQuizById: builder.query({
      query: ({ courseId, quizId }) => ({
        url: `/${courseId}/quiz/${quizId}`,
        method: "GET",
      }),
    }),

    addNotice: builder.mutation({
      query: ({ courseId, noticeData }) => ({
        url: `/${courseId}/notices`, // ✅ Matches course.route.js
        method: "POST",
        body: noticeData,
      }),
    }),


    getCourseNotices: builder.query({
      query: (courseId) => `/${courseId}/notices`, // ✅ Matches backend route
    }),


    deleteNotice: builder.mutation({
      query: ({ courseId, noticeId }) => ({
        url: `/${courseId}/notice/${noticeId}`, // changed from `/notices/:noticeIndex`
        method: "DELETE",
      }),
    }),

    togglePinNotice: builder.mutation({
      query: ({ courseId, noticeId, pin }) => ({
        url: `/${courseId}/notices/${noticeId}/toggle-pin`,
        method: "PUT",
        body: { pin },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    // ✅ Add Live Class
    addLiveClass: builder.mutation({
      query: ({ courseId, liveClassData }) => ({
        url: `/${courseId}/add-live-class`,
        method: "POST",
        body: liveClassData, // ✅ must match what's destructured
      }),
    }),

    // ✅ Delete Live Class
    deleteLiveClass: builder.mutation({
      query: ({ courseId, liveClassId }) => ({
        url: `/${courseId}/live/${liveClassId}`, // backend route
        method: "DELETE",
      }),
    }),





    // ✅ Submit or update a review
    rateCourse: builder.mutation({
      query: ({ courseId, rating, comment }) => ({
        url: `/${courseId}/rate`,
        method: "POST",
        body: { rating, comment },
      }),
    }),

    // ✅ Delete review
    // ✅ Fix deleteReview
    deleteReview: builder.mutation({
      query: ({ courseId, reviewId }) => ({
        url: `/${courseId}/review/${reviewId}`,  // ✅ fixed
        method: "DELETE",
      }),
    }),

    // ✅ Fix getCourseReviews
    getCourseReviews: builder.query({
      query: (courseId) => `/${courseId}/reviews`, // ✅ fixed
    }),










  }),
});

// ✅ Export hooks
export const {
  useCreateCourseMutation,
  useGetSearchCourseQuery,
  useGetPublishedCourseQuery,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
  useDeleteCourseMutation,
  useUploadCoursePDFMutation,
  useCreateQuizMutation,
  useGetCourseQuizzesQuery,
  useDeleteQuizMutation,
  useDeleteQuizQuestionMutation,
  useUpdateQuizMutation,
  useGetQuizByIdQuery,
  useAddNoticeMutation,
  useGetCourseNoticesQuery,
  useDeleteNoticeMutation,
  useTogglePinNoticeMutation,
  useRateCourseMutation,
  useDeleteReviewMutation,
  useGetCourseReviewsQuery,
  useAddLiveClassMutation,
  useDeleteLiveClassMutation,


} = courseApi;

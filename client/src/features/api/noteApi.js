// features/api/noteApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const NOTE_API_BASE = "http://localhost:8080/api/notes";

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: NOTE_API_BASE,
    credentials: "include", // for cookie-based auth
  }),
  tagTypes: ["Note"],

  endpoints: (builder) => ({
    // ✅ GET all notes for a lecture
    getLectureNotes: builder.query({
      query: ({ courseId, lectureId }) => `/${courseId}/${lectureId}`,
      providesTags: (result) =>
        result
          ? [...result.map((note) => ({ type: "Note", id: note._id })), { type: "Note", id: "LIST" }]
          : [{ type: "Note", id: "LIST" }],
    }),

    // ✅ CREATE a note
    createNote: builder.mutation({
      query: ({ courseId, lectureId, content, timestamp }) => ({
        url: `/`,
        method: "POST",
        body: { courseId, lectureId, content, timestamp },
      }),
      invalidatesTags: [{ type: "Note", id: "LIST" }],
    }),

    // ✅ UPDATE a note
    updateNote: builder.mutation({
      query: ({ noteId, content, timestamp }) => ({
        url: `/${noteId}`,
        method: "PUT",
        body: { content, timestamp },
      }),
      invalidatesTags: (result, error, { noteId }) => [
        { type: "Note", id: noteId },
      ],
    }),

    // ✅ DELETE a note
    deleteNote: builder.mutation({
      query: (noteId) => ({
        url: `/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, noteId) => [
        { type: "Note", id: noteId },
        { type: "Note", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetLectureNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApi;

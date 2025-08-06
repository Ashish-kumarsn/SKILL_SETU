import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const GEMINI_API = `${import.meta.env.VITE_BASE_API_URL}/chatbot/`;

export const geminiApi = createApi({
  reducerPath: "geminiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: GEMINI_API,
    credentials: "include", // if you're using cookies
  }),
  endpoints: (builder) => ({
    // ✅ Existing askGemini endpoint
    askGemini: builder.mutation({
      query: ({ prompt }) => ({
        url: "ask",
        method: "POST",
        body: { prompt },
      }),
    }),

    // ✅ New GET chat history endpoint
    getChatHistory: builder.query({
      query: () => "history",
    }),

    // ✅ New DELETE clear history endpoint
    clearChatHistory: builder.mutation({
      query: () => ({
        url: "clear-history",
        method: "DELETE",
      }),
    }),
  }),
});

// ✅ Export hooks for all endpoints
export const {
  useAskGeminiMutation,
  useGetChatHistoryQuery,
  useClearChatHistoryMutation,
} = geminiApi;

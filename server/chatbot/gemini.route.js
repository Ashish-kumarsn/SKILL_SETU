import express from "express";
import { handleChatWithGemini } from "./gemini.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getChatHistory, clearChatHistory } from "./geminiHistory.controller.js"; // New controller for history

const router = express.Router();

// ✅ Ask Gemini bot (existing)
router.post("/ask", isAuthenticated, handleChatWithGemini);

// ✅ Get full chat history of user
router.get("/history", isAuthenticated, getChatHistory);

// ✅ Clear user's chat history
router.delete("/clear-history", isAuthenticated, clearChatHistory);

export default router;

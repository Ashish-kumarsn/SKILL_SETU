import { ChatHistory } from "../models/ChatHistory.js";

// ✅ Fetch chat history for logged-in user
export const getChatHistory = async (req, res) => {
  const userId = req.id;

  try {
    const chats = await ChatHistory.find({ user: userId })
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch chat history." });
  }
};

// ✅ Clear chat history for logged-in user
export const clearChatHistory = async (req, res) => {
  const userId = req.id;

  try {
    await ChatHistory.deleteMany({ user: userId });
    res.status(200).json({ success: true, message: "Chat history cleared successfully." });
  } catch (error) {
    console.error("Error clearing chat history:", error.message);
    res.status(500).json({ success: false, error: "Failed to clear chat history." });
  }
};

import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GeminiUser",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Named export to match your import style
export const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

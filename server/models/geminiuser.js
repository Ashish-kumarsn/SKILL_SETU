import mongoose from "mongoose";

const geminiUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter user's name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter user's email"],
      unique: true,
      lowercase: true,
    },
    goals: {
      type: [String],
      default: [],
    },
    favoriteLanguages: {
      type: [String],
      default: [],
    },
    preferences: {
      theme: {
        type: String,
        enum: ["dark", "light"],
        default: "dark",
      },
      typingStyle: {
        type: String,
        enum: ["fast", "slow", "realistic"],
        default: "realistic",
      },
    },
  },
  { timestamps: true }
);

// ✅ Named export
export const GeminiUser = mongoose.model("GeminiUser", geminiUserSchema);

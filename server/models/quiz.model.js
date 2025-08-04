import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true } // Index (0-3)
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  timeLimit: { type: Number, default: 300 }, // in seconds
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  questions: [questionSchema]
}, { timestamps: true });

export const Quiz = mongoose.model("Quiz", quizSchema);

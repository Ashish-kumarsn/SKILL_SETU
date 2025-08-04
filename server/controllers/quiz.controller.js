import { Quiz } from "../models/quiz.model.js";
import { Course } from "../models/course.model.js";

// ✅ Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { quizTitle, questions, quizTimer } = req.body;
    const { courseId } = req.params;

    if (!quizTitle || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title and questions required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newQuiz = await Quiz.create({
      title: quizTitle,
      questions,
      timeLimit: Number(quizTimer),
      course: courseId,
    });

    course.quizzes.push(newQuiz._id);
    await course.save();

    return res.status(201).json({ quiz: newQuiz, message: "Quiz created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Quiz creation failed", error: error.message });
  }
};


// ✅ Get all quizzes for a course
export const getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("quizzes");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({
      quizzes: course.quizzes,
      message: "Quizzes fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get quizzes", error: error.message });
  }
};

// ✅ Get a single quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json({ quiz, message: "Quiz fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to get quiz", error: error.message });
  }
};

// ✅ Submit quiz attempt (placeholder)
export const submitQuizAttempt = async (req, res) => {
  try {
    res.status(200).json({ message: "Submit quiz - coming soon 🚀" });
  } catch (error) {
    res.status(500).json({ message: "Quiz submission failed", error: error.message });
  }
};

// ✅ Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId, courseId } = req.params;

    // 1. Delete the quiz document
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 2. Remove quiz ID from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { quizzes: quizId },
    });

    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete quiz", error: error.message });
  }
};

// ✅ Delete a specific question from quiz
export const deleteQuizQuestion = async (req, res) => {
  try {
    const { quizId, questionIndex } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    quiz.questions.splice(questionIndex, 1);
    await quiz.save();

    return res.status(200).json({ message: "Question removed", quiz });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete question", error: error.message });
  }
};


// ✅ Update an entire quiz (title, timer, questions)
export const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { quizTitle, quizTimer, questions } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quizTitle) quiz.title = quizTitle;
    if (quizTimer != null) quiz.timeLimit = Number(quizTimer);

    if (questions) quiz.questions = questions;

    await quiz.save();

    return res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update quiz", error: error.message });
  }
};


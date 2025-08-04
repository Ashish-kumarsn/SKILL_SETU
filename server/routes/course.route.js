import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

// ✅ FIXED: Use named multer exports
import { uploadProfile, uploadVideo, uploadPDF } from "../utils/multer.js";

import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getLectureById,
  getPublishedCourse,
  removeLecture,
  searchCourse,
  togglePublishCourse,
  deleteCourse,
  uploadCoursePDF,
  addCourseNotice,
  getCourseNotices,
  deleteCourseNotice,
  togglePinNotice,
  rateCourse,
  deleteReview,
  getCourseReviews,
  addLiveClass,
  deleteLiveClass,
} from "../controllers/course.controller.js";

import {
  createQuiz,
  getCourseQuizzes,
  getQuizById,
  submitQuizAttempt,
  deleteQuiz,
  deleteQuizQuestion,
  updateQuiz,
} from "../controllers/quiz.controller.js";

const router = express.Router();

// ✅ Course operations
router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/published-courses").get(getPublishedCourse);

// ✅ Specific course by ID
router.route("/:courseId")
  .put(isAuthenticated, uploadProfile.single("courseThumbnail"), editCourse) // thumbnail is an image
  .get(isAuthenticated, getCourseById);

// ✅ Publish/unpublish course
router.route("/:courseId/publish").put(isAuthenticated, togglePublishCourse);

// ✅ Lecture operations
router.route("/:courseId/lecture")
  .post(isAuthenticated, createLecture)
  .get(isAuthenticated, getCourseLecture);

router.route("/:courseId/lecture/:lectureId")
  .put(isAuthenticated, editLecture)
  .get(isAuthenticated, getLectureById)
  .delete(isAuthenticated, removeLecture);

// ✅ PDF Upload Route
router.post("/:courseId/upload-pdf", isAuthenticated, uploadPDF.single("pdf"), uploadCoursePDF);

// ✅ Quiz operations
router.post("/:courseId/create-quiz", isAuthenticated, createQuiz);
router.get("/:courseId/quiz", isAuthenticated, getCourseQuizzes);
router.get("/:courseId/quiz/:quizId", isAuthenticated, getQuizById);
router.post("/:courseId/quiz/:quizId/submit", isAuthenticated, submitQuizAttempt);
router.delete("/:courseId/quiz/:quizId", isAuthenticated, deleteQuiz);
router.delete("/quiz/:quizId/question/:questionIndex", isAuthenticated, deleteQuizQuestion);
router.put("/quiz/:quizId", isAuthenticated, updateQuiz);
router.post("/:courseId/notices", isAuthenticated, addCourseNotice);
router.get("/:courseId/notices", isAuthenticated, getCourseNotices);
router.delete("/:courseId/notice/:noticeId", isAuthenticated, deleteCourseNotice);
router.put("/:courseId/notices/:noticeId/toggle-pin", togglePinNotice);
router.post("/:courseId/rate", isAuthenticated, rateCourse);
router.delete('/:courseId/review/:reviewId', isAuthenticated, deleteReview);
router.get('/:courseId/reviews', isAuthenticated, getCourseReviews);

// live class route 
router.post("/:courseId/add-live-class", isAuthenticated, addLiveClass); // ✅ NEW ROUTE
// ✅ Delete live class
router.delete("/:courseId/live/:liveClassId", isAuthenticated, deleteLiveClass);









// ✅ Admin-only: Delete course
router.route("/admin/delete-course/:courseId")
  .delete(isAuthenticated, deleteCourse);

export default router;

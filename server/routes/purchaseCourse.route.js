import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,
  getInstructorEarnings,
  getInstructorPurchaseStats, // ✅ newly added controller
  stripeWebhook, // ✅ Stripe webhook
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

// ✅ Stripe webhook — NO authentication, must use raw body
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }), // ❗ Stripe requires raw
//   stripeWebhook
// );

// ✅ Protected routes (requires login)
router.route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);

router.route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, getCourseDetailWithPurchaseStatus);

router.route("/")
  .get(isAuthenticated, getAllPurchasedCourse);

// ✅ NEW: Instructor-specific stats route
router.route("/instructor-stats")
  .get(isAuthenticated, getInstructorPurchaseStats);

router.route("/instructor/earnings").get(isAuthenticated, getInstructorEarnings);

export default router;

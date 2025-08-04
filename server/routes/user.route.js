import express from "express";
import {
  getUserProfile,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadProfile } from "../utils/multer.js"; // ✅ Correct named import

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Profile
router.get("/profile", isAuthenticated, getUserProfile);
router.put(
  "/profile/update",
  isAuthenticated,
  uploadProfile.single("profilePhoto"),
  updateProfile
);

export default router;

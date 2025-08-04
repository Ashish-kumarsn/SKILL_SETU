import express from "express";
import { generateCertificate } from "../controllers/certificate.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";



const router = express.Router();

// GET /api/certificate/generate/:courseId
router.get("/generate/:courseId", isAuthenticated, generateCertificate);


export default router;

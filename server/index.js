import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import { stripeWebhook } from "./controllers/coursePurchase.controller.js";
import certificateRoutes from "./routes/certificate.route.js";
import chatbotRoutes from "./chatbot/gemini.route.js";
import noteRoutes from './routes/noteRoutes.js';


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ 1. Webhook route FIRST, with `express.raw`
app.post("/api/v1/purchase/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// ✅ 2. Then regular middlewares AFTER webhook
app.use(express.json()); // Must be AFTER webhook
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// ✅ 3. Other API routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute); // Don’t re-handle webhook here!
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/certificate", certificateRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use('/api/notes', noteRoutes);

// ✅ 4. Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening at port ${PORT}`);
});

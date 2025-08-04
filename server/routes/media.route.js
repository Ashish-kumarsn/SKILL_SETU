import express from "express";
import { uploadVideo, uploadPDF } from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

// 🎥 Upload video
router.post("/upload-video", uploadVideo.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);
    res.status(200).json({
      success: true,
      message: "Video uploaded successfully.",
      data: result,
    });
  } catch (error) {
    console.error("❌ Video upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading video",
    });
  }
});

// 📄 Upload PDF
router.post("/upload-pdf", uploadPDF.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);
    res.status(200).json({
      success: true,
      message: "PDF uploaded successfully.",
      data: result,
    });
  } catch (error) {
    console.error("❌ PDF upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading PDF",
    });
  }
});

export default router;

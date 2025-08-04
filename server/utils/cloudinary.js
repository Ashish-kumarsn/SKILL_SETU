import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Upload Media (image/video/pdf)
export const uploadMedia = async (file) => {
  try {
    const isPDF =
      (typeof file === "string" && file.endsWith(".pdf")) ||
      (typeof file === "string" && file.startsWith("data:application/pdf"));

    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: isPDF ? "raw" : "auto",
      type: "upload", // 👈 fixes "Blocked for delivery"
    });

    // ✅ Delete temp file if uploaded from disk (optional)
    if (typeof file === "string" && file.startsWith("uploads/")) {
      fs.unlinkSync(file);
    }

    return uploadResponse;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

// ✅ Delete any media (image or raw like PDF)
export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    let result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "not found") {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }
    return result;
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    throw error;
  }
};

// ✅ Delete video specifically
export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.error("Cloudinary Video Deletion Error:", error);
    throw error;
  }
};

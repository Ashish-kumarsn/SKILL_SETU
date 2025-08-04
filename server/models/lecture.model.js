import mongoose from "mongoose";
console.log("Lecture model loaded");
const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: false, // optional field
    },
    videoUrl: { type: String },
    publicId: { type: String },
    isPreviewFree: { type: Boolean },
}, { timestamps: true });

export const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);


import PDFDocument from "pdfkit";
import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.js";
import { User } from "../models/user.model.js";

export const generateCertificate = async (req, res) => {
    try {
        console.log("📥 Certificate request received");

        const userId = req.id;
        const { courseId } = req.params;
        console.log("✅ Params:", { userId, courseId });

        if (!userId) {
            console.log("❌ No user ID found on request");
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const course = await Course.findById(courseId).populate("lectures");
        const user = await User.findById(userId);
        const progress = await CourseProgress.findOne({ userId, courseId });

        console.log("👤 User:", user?.name || "Not found");
        console.log("📚 Course:", course?.courseTitle || "Not found");
        console.log("📈 Progress found:", !!progress);

        if (!course) {
            console.log("❌ Course not found");
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (!progress) {
            console.log("❌ No course progress found");
            return res.status(400).json({
                success: false,
                message: "You have not started the course yet",
            });
        }

        const completedLecturesCount = progress.lectureProgress.filter(p => p.viewed).length;
        const totalLectures = course.lectures.length;

        console.log("✅ Completed Lectures:", completedLecturesCount);
        console.log("✅ Total Lectures in Course:", totalLectures);

        if (totalLectures === 0) {
            return res.status(400).json({
                success: false,
                message: "This course has no lectures added yet.",
            });
        }

        if (completedLecturesCount < totalLectures) {
            console.log("❌ Course not fully completed");
            return res.status(400).json({
                success: false,
                message: "Please complete all lectures to generate the certificate",
            });
        }


        console.log("🎓 All checks passed. Generating certificate...");

        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="certificate.pdf"');

        doc.pipe(res);

        doc
            .fontSize(30)
            .text("Certificate of Completion", { align: "center" })
            .moveDown(2);

        doc
            .fontSize(20)
            .text(`This is to certify that`, { align: "center" })
            .moveDown();

        doc
            .fontSize(25)
            .text(`${user.name}`, { align: "center", underline: true })
            .moveDown();

        doc
            .fontSize(20)
            .text(`has successfully completed the course`, { align: "center" })
            .moveDown();

        doc
            .fontSize(25)
            .text(`${course.courseTitle}`, { align: "center", underline: true })
            .moveDown(2);

        doc
            .fontSize(14)
            .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });

        doc.end();

        console.log("✅ Certificate PDF successfully streamed");
    } catch (error) {
        console.error("🔥 Error during certificate generation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate certificate",
        });
    }
};

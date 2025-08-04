import axios from "axios";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.js";
import { GeminiUser } from "../models/geminiuser.js";
import { ChatHistory } from "../models/ChatHistory.js";

export const handleChatWithGemini = async (req, res) => {
  const promptRaw = req.body.prompt;

  if (typeof promptRaw !== "string") {
    return res.status(400).json({ error: "Prompt must be a string." });
  }

  const prompt = promptRaw.trim();
  const userId = req.id;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and userId are required." });
  }

  try {
    // ✅ Fetch user with enrolled courses
    const user = await User.findById(userId).populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // ✅ Fetch or create GeminiUser for personalisation
    let genieUser = await GeminiUser.findOne({ userId });
    if (!genieUser) {
  genieUser = await GeminiUser.findOneAndUpdate(
    { email: user.email }, // find by email
    { name: user.name, email: user.email }, // update data
    { new: true, upsert: true, setDefaultsOnInsert: true } // create if not exists
  );
}



    // ✅ Fetch previous chat history
    const previousChats = await ChatHistory.find({ user: userId }).sort({ createdAt: 1 });

    // ✅ Build context for LMS data (existing feature untouched)
    let context = "";
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("my name")) {
      context += `User's name is ${user.name}. `;
    }
    if (lowerPrompt.includes("my email")) {
      context += `User's email is ${user.email}. `;
    }
    if (lowerPrompt.includes("my role")) {
      context += `User's role is ${user.role}. `;
    }

    // ✅ Enrolled courses data
    if (
      lowerPrompt.includes("my courses") ||
      lowerPrompt.includes("enrolled courses") ||
      lowerPrompt.includes("pdf") ||
      lowerPrompt.includes("quiz") ||
      lowerPrompt.includes("live class") ||
      lowerPrompt.includes("notice")
    ) {
      if (user.enrolledCourses.length === 0) {
        context += "User is not enrolled in any courses. ";
      } else {
        context += `User is enrolled in ${user.enrolledCourses.length} course(s): `;

        const enrolledCourseIds = user.enrolledCourses.map(c => c._id.toString());
        const courseProgress = await CourseProgress.find({
          userId: userId.toString(),
          courseId: { $in: enrolledCourseIds }
        });

        user.enrolledCourses.forEach((course, index) => {
          const progress = courseProgress.find(p => p.courseId === course._id.toString());
          const lecturesViewed = progress?.lectureProgress.filter(l => l.viewed).length || 0;
          const totalLectures = progress?.lectureProgress.length || course.lectures.length;

          context += `
- Course ${index + 1}:
  • Title: ${course.courseTitle}
  • Subtitle: ${course.subTitle || "N/A"}
  • Description: ${course.description || "N/A"}
  • Category: ${course.category}
  • Level: ${course.courseLevel || "N/A"}
  • Price: ₹${course.coursePrice}
  • Lectures: ${course.lectures.length} (Viewed: ${lecturesViewed}/${totalLectures})
  • Completed: ${progress?.completed ? "Yes" : "No"}
`;

          // PDFs
          if (course.pdfs && course.pdfs.length > 0) {
            context += `  • PDFs:\n`;
            course.pdfs.forEach((pdf, i) => {
              context += `    - [${i + 1}] ${pdf.title}: ${pdf.url}\n`;
            });
          }

          // Quizzes
          if (course.quizzes && course.quizzes.length > 0) {
            context += `  • Quizzes: ${course.quizzes.length} quiz(es) available.\n`;
          }

          // Live classes
          if (course.liveClasses && course.liveClasses.length > 0) {
            context += `  • Live Classes:\n`;
            course.liveClasses.forEach((cls, i) => {
              context += `    - [${i + 1}] ${cls.title} at ${cls.startTime.toLocaleString()} [Link: ${cls.meetingLink}]\n`;
            });
          }

          // Notices
          if (course.notices && course.notices.length > 0) {
            context += `  • Notices:\n`;
            course.notices.forEach((notice, i) => {
              context += `    - [${i + 1}] ${notice.title}: ${notice.message} [Pinned: ${notice.pinned ? "Yes" : "No"}]\n`;
            });
          }
        });
      }
    }

    // ✅ All available courses
    if (
      lowerPrompt.includes("what are the courses") ||
      lowerPrompt.includes("courses present") ||
      lowerPrompt.includes("available courses") ||
      lowerPrompt.includes("all courses")
    ) {
      const allCourses = await Course.find({ isPublished: true });
      if (allCourses.length === 0) {
        context += "No courses are available on the platform at this time. ";
      } else {
        context += `There are ${allCourses.length} published courses available:\n`;
        allCourses.forEach((course, index) => {
          context += `
- Course ${index + 1}:
  • Title: ${course.courseTitle}
  • Subtitle: ${course.subTitle || "N/A"}
  • Description: ${course.description || "N/A"}
  • Category: ${course.category}
  • Level: ${course.courseLevel || "N/A"}
  • Price: ₹${course.coursePrice}
  • Total Lectures: ${course.lectures.length}
  • Average Rating: ${course.averageRating} (${course.numOfRatings} ratings)
`;
        });
      }
    }

    // ✅ Final prompt with personalisation and previous chats
    const finalPrompt = `
You are a friendly, supportive AI friend named 'Genie'. You talk casually, use emojis, and keep responses human-like and personal.

The user chatting is ${genieUser.name || user.name}.

Here is their chat history so far:
${previousChats.map(m => `${m.type === "user" ? "User" : "Genie"}: ${m.message}`).join("\n")}

${context}

Now answer their latest query in detail:
"${prompt}"
`;

    // ✅ Call Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: finalPrompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GEMINI_API_KEY
        }
      }
    );

    const generatedText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

    // ✅ Save user prompt and bot response to ChatHistory
    await ChatHistory.create({ user: userId, message: prompt, type: "user" });
    await ChatHistory.create({ user: userId, message: generatedText, type: "bot" });

    // ✅ Send response
    res.status(200).json({ response: generatedText });
  } catch (error) {
    console.error("Gemini API error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate response from Gemini." });
  }
};

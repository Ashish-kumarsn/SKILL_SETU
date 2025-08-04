import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia
} from "../utils/cloudinary.js";


// ✅ Create Course
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res.status(400).json({ message: "Course title and category are required." });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id
    });

    return res.status(201).json({ course, message: "Course created." });

  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return res.status(500).json({ message: "Failed to create course.", error: error.message });
  }
};

// ✅ Search Published Courses
export const searchCourse = async (req, res) => {
  try {
    let { query = "", categories = "", sortByPrice = "" } = req.query;

    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ]
    };

    if (categories) {
      const categoryArray = categories.split(",").map((cat) => cat.trim());
      if (categoryArray.length > 0) {
        searchCriteria.category = { $in: categoryArray };
      }
    }

    const sortOptions = {};
    if (sortByPrice === "low") sortOptions.coursePrice = 1;
    if (sortByPrice === "high") sortOptions.coursePrice = -1;

    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({ success: true, courses });

  } catch (error) {
    console.error("SEARCH COURSE ERROR:", error);
    return res.status(500).json({ success: false, message: "Search failed.", error: error.message });
  }
};

// ✅ Get All Published Courses
export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate("creator", "name photoUrl");

    if (!courses.length) return res.status(404).json({ message: "No published courses found." });

    return res.status(200).json({ courses });

  } catch (error) {
    return res.status(500).json({ message: "Failed to get published courses.", error: error.message });
  }
};

// ✅ Get Creator's Courses
export const getCreatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.id });
    return res.status(200).json({ courses, message: courses.length ? "Courses retrieved." : "No courses found." });

  } catch (error) {
    return res.status(500).json({ message: "Failed to get creator courses.", error: error.message });
  }
};

// ✅ Edit Course
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      courseTitle, subTitle, description,
      category, courseLevel, coursePrice
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      const uploaded = await uploadMedia(thumbnail.path);
      course.courseThumbnail = uploaded?.secure_url;
    }

    course.courseTitle = courseTitle;
    course.subTitle = subTitle;
    course.description = description;
    course.category = category;
    course.courseLevel = courseLevel;
    course.coursePrice = coursePrice;

    await course.save();

    return res.status(200).json({ course, message: "Course updated successfully." });

  } catch (error) {
    return res.status(500).json({ message: "Failed to update course.", error: error.message });
  }
};

// ✅ Get Course by ID
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("quizzes"); // ✅ Fetch full quiz objects

    if (!course) return res.status(404).json({ message: "Course not found!" });

    return res.status(200).json({ course });

  } catch (error) {
    return res.status(500).json({ message: "Failed to get course.", error: error.message });
  }
};


// ✅ Create Lecture
// ✅ Create Lecture

export const createLecture = async (req, res) => {
  try {
    console.log("📨 Request body received:", req.body);

    const { lectureTitle, chapter } = req.body; // ✅ get chapter from body
    const { courseId } = req.params;

    if (!lectureTitle) {
      return res.status(400).json({ message: "Lecture title is required." });
    }

    const lecture = await Lecture.create({ lectureTitle, chapter }); // ✅ store chapter
    console.log("📦 Created lecture:", lecture); 
    const course = await Course.findById(courseId);

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({ lecture, message: "Lecture created." });

  } catch (error) {
    return res.status(500).json({ message: "Failed to create lecture.", error: error.message });
  }
};


// ✅ Get Lectures by Course
export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");

    if (!course) return res.status(404).json({ message: "Course not found." });

    return res.status(200).json({ lectures: course.lectures });

  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch lectures.", error: error.message });
  }
};

// ✅ Edit Lecture
export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found!" });

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (typeof isPreviewFree === "boolean") lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({ lecture, message: "Lecture updated." });

  } catch (error) {
    return res.status(500).json({ message: "Failed to edit lecture.", error: error.message });
  }
};

// ✅ Remove Lecture
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found!" });

    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    await Course.updateOne({ lectures: lectureId }, { $pull: { lectures: lectureId } });

    return res.status(200).json({ message: "Lecture removed successfully." });

  } catch (error) {
    return res.status(500).json({ message: "Failed to remove lecture.", error: error.message });
  }
};

// ✅ Get Single Lecture by ID
export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found!" });

    return res.status(200).json({ lecture });

  } catch (error) {
    return res.status(500).json({ message: "Failed to get lecture.", error: error.message });
  }
};


// ✅ Add Live Class to Course
export const addLiveClass = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, meetingLink, scheduledTime } = req.body;

    if (!title || !meetingLink || !scheduledTime) {
      return res.status(400).json({ message: "All fields are required: title, meetingLink, scheduledTime." });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const newLiveClass = {
  title,
  meetingLink,
  startTime: new Date(scheduledTime), // ✅ correct field name
};


    course.liveClasses.push(newLiveClass);
    await course.save();

    return res.status(201).json({ message: "Live class added successfully", liveClass: newLiveClass });
  } catch (error) {
    console.error("❌ Error adding live class:", error);
    return res.status(500).json({ message: "Failed to add live class", error: error.message });
  }
};

//delete live 
export const deleteLiveClass = async (req, res) => {
  const { courseId, liveClassId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Filter out the live class to delete
    course.liveClasses = course.liveClasses.filter(
      (cls) => cls._id.toString() !== liveClassId
    );

    await course.save();
    res.status(200).json({ message: "Live class deleted successfully" });
  } catch (error) {
    console.error("Error deleting live class:", error);
    res.status(500).json({ message: "Failed to delete live class" });
  }
};



// ✅ Toggle Publish / Unpublish Course
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    course.isPublished = publish === "true";
    await course.save();

    return res.status(200).json({
      message: `Course is ${course.isPublished ? "Published" : "Unpublished"}`,
    });

  } catch (error) {
    return res.status(500).json({ message: "Failed to change publish status.", error: error.message });
  }
};

// ✅ Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    for (let lectureId of course.lectures) {
      const lecture = await Lecture.findByIdAndDelete(lectureId);
      if (lecture?.publicId) await deleteVideoFromCloudinary(lecture.publicId);
    }

    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({ message: "Course deleted successfully!" });

  } catch (error) {
    return res.status(500).json({ message: "Failed to delete course.", error: error.message });
  }
};

// ✅ Upload PDF to Course
// ✅ Upload PDF to Course
export const uploadCoursePDF = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    console.log("📥 Title from request body:", title);
    console.log("📄 File info:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No PDF file provided." });
    }

    const filePath = req.file.path; // path like "uploads/myfile.pdf"

    const uploadResult = await uploadMedia(filePath); // ✅ Upload from file path
    console.log("✅ Upload Result:", uploadResult);

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const newPdf = {
      title: title || "Untitled PDF",
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };

    course.pdfs.push(newPdf);
    await course.save();

    return res.status(201).json({ message: "PDF uploaded successfully.", pdf: newPdf });
  } catch (error) {
    console.error("UPLOAD PDF ERROR:", error);
    return res.status(500).json({ message: "Failed to upload PDF.", error: error.message });
  }
};

// add notice 
// ✅ Add Notice with Optional Pinned Flag
export const addCourseNotice = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, message, pinned = false } = req.body; // ✅ include pinned (default to false)

    if (!title || !message) {
      return res.status(400).json({ success: false, message: "Title and message are required." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // ✅ Push notice to notices array with pinned
    course.notices.push({ title, message, pinned });

    await course.save();

    res.status(200).json({
      success: true,
      message: "Notice added successfully.",
      notices: course.notices,
    });
  } catch (error) {
    console.error("Error adding notice:", error);
    res.status(500).json({ success: false, message: "Failed to add notice." });
  }
};





// get all notice 
export const getCourseNotices = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // ✅ Sort pinned notices first
    const sortedNotices = [...course.notices].sort((a, b) => {
      return (b.pinned === true) - (a.pinned === true); // pinned=true comes first
    });

    res.status(200).json({ notices: sortedNotices });
  } catch (err) {
    console.error("❌ Error getting notices:", err);
    res.status(500).json({ message: "Error retrieving notices" });
  }
};


//delete notice
export const deleteCourseNotice = async (req, res) => {
  try {
    const { courseId, noticeId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const initialLength = course.notices.length;

    course.notices = course.notices.filter(
      (notice) => notice._id.toString() !== noticeId
    );

    if (course.notices.length === initialLength) {
      return res.status(404).json({ message: "Notice not found" });
    }

    await course.save();

    return res.status(200).json({
      message: "Notice deleted successfully",
      notices: course.notices,
    });
  } catch (err) {
    console.error("❌ Error deleting notice:", err);
    res.status(500).json({ message: "Error deleting notice" });
  }
};


// ✅ Toggle Pin on Notice
export const togglePinNotice = async (req, res) => {
  try {
    const { courseId, noticeId } = req.params;
    const { pin } = req.body; // expects boolean

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const notice = course.notices.id(noticeId);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    notice.pinned = pin; // ✅ Update pinned status
    await course.save();

    return res.status(200).json({
      message: `Notice ${pin ? "pinned" : "unpinned"} successfully`,
      notice,
    });
  } catch (err) {
    console.error("❌ Error toggling pin:", err);
    res.status(500).json({ message: "Error toggling pin status" });
  }
};

// review system 
export const rateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.id;

    const course = await Course.findById(courseId).populate('reviews.user');
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if user already rated
    const existingReview = course.reviews.find(
      (r) => r.user._id.toString() === userId
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      course.reviews.push({ user: userId, rating, comment });
    }

    // Recalculate average
    const total = course.reviews.reduce((acc, r) => acc + r.rating, 0);
    course.averageRating = total / course.reviews.length;
    course.numOfRatings = course.reviews.length;

    await course.save();
    return res.status(200).json({ message: "Review submitted" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete review 
export const deleteReview = async (req, res) => {
  try {
    const { courseId, reviewId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Filter out the review to delete
    const filteredReviews = course.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );

    course.reviews = filteredReviews;
    course.numOfRatings = filteredReviews.length;

    if (filteredReviews.length > 0) {
      course.averageRating =
        filteredReviews.reduce((sum, r) => sum + r.rating, 0) /
        filteredReviews.length;
    } else {
      course.averageRating = 0;
    }

    await course.save();

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete review" });
  }
};


// @route GET /api/course/:courseId/reviews
// GET /api/course/:courseId/reviews

export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("reviews.user", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ reviews: course.reviews });
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    res.status(500).json({ message: "Failed to fetch course reviews" });
  }
};



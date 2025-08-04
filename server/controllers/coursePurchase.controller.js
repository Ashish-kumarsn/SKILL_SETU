import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/course-progress/${courseId}`,
      cancel_url: `http://localhost:5173/course-detail/${courseId}`,
      metadata: { courseId, userId },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    if (!session.url) {
      return res.status(400).json({ success: false, message: "Error while creating session" });
    }

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("❌ Stripe Checkout Session Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create Stripe checkout session." });
  }
};

// ✅ Stripe Webhook for Checkout
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
    console.log("✅ Stripe webhook received:", event.type); // 🧪 Add this
  } catch (err) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Checkout session completed:", session.id); // 🧪 Add this

    const purchase = await CoursePurchase.findOne({ paymentId: session.id });
    if (!purchase) {
      console.log("❌ Purchase not found for session:", session.id);
      return res.status(404).json({ message: "Purchase not found" });
    }

    purchase.status = "completed";
    if (session.amount_total) {
      purchase.amount = session.amount_total / 100;
    }
    await purchase.save();

    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId } },
      { new: true }
    );

    await Course.findByIdAndUpdate(
      purchase.courseId,
      { $addToSet: { enrolledStudents: purchase.userId } },
      { new: true }
    );

    console.log("✅ Purchase & user/course updated in DB");
  }

  res.status(200).send();
};


// ✅ Get Course Details + Purchase Status
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) return res.status(404).json({ message: "Course not found!" });

    return res.status(200).json({ course, purchased: !!purchased });
  } catch (error) {
    console.log(error);
  }
};

// ✅ Get All Purchased Courses (for a User)
export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;

    const purchasedCourses = await CoursePurchase.find({
      userId,
      status: "completed",
    }).populate({
      path: "courseId",
      select: "courseTitle courseThumbnail subTitle coursePrice",
    });

    return res.status(200).json({
      purchasedCourses: purchasedCourses || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while fetching your courses.",
    });
  }
};

// ✅ NEW: Instructor Sales + Revenue Stats
export const getInstructorPurchaseStats = async (req, res) => {
  try {
    const instructorId = req.id;

    // 1. Get all courses by instructor
    const instructorCourses = await Course.find({ creator: instructorId }).select("_id enrolledStudents");

    const courseIds = instructorCourses.map(course => course._id);

    // 2. Get completed purchases of instructor's courses
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
    const totalSales = purchases.length;

    // 3. Total enrolled course count (sum of all enrolled students in all courses)
    const totalEnrolledCourses = instructorCourses.reduce(
      (sum, course) => sum + (course.enrolledStudents?.length || 0), 0
    );

    // 4. Unique student count (Set of userIds from purchases)
    const uniqueStudentIds = new Set(purchases.map(p => p.userId.toString()));
    const totalStudents = uniqueStudentIds.size;

    // 5. Total subscriptions (same as totalSales in this case)
    const totalSubscriptions = totalSales;

    return res.status(200).json({
      totalRevenue,
      totalSales,
      totalStudents,
      totalEnrolledCourses,
      totalSubscriptions,
    });
  } catch (error) {
    console.error("❌ Error in instructor stats:", error);
    return res.status(500).json({
      message: "Failed to fetch instructor stats.",
    });
  }
};


export const getInstructorEarnings = async (req, res) => {
  try {
    const instructorId = req.id;

    const purchases = await CoursePurchase.find({ status: "completed" })
      .populate({
        path: "courseId",
        match: { creator: instructorId },
        select: "_id courseTitle",
      });

    const earningsMap = {};

    purchases.forEach((purchase) => {
      const course = purchase.courseId;
      if (course) {
        const title = course.courseTitle;
        if (!earningsMap[title]) {
          earningsMap[title] = 0;
        }
        earningsMap[title] += purchase.amount;
      }
    });

    const earningsData = Object.entries(earningsMap).map(([name, revenue]) => ({
      name,
      revenue,
    }));

    res.status(200).json({ success: true, data: earningsData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

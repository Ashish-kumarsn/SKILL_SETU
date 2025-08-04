import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true,
    },

    subTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    courseLevel: {
        type: String,
        enum: ["Beginner", "Medium", "Advance"],
    },

    coursePrice: {
        type: Number,
        default: 0,
    },

    courseThumbnail: {
        type: String,
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
        },
    ],

    // ✅ New field for storing PDF materials
    pdfs: [
        {
            title: { type: String },
            url: { type: String },
            public_id: { type: String }
        }
    ],
    //quizzes 
    quizzes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz"
        }
    ],
    //live class integration 
    // ✅ Live Classes for Jitsi Integration
    liveClasses: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                auto: true,
            },
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            meetingLink: {
                type: String,
                required: true,
            },
            startTime: {
                type: Date,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    //noticeboard 

    notices: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                auto: true,
            },
            title: {
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            pinned: {
                type: Boolean,
                default: false,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    // review 
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            comment: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfRatings: {
        type: Number,
        default: 0,
    },

    // creator 

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    isPublished: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);

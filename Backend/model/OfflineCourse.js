import mongoose from "mongoose";

const OfflineCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    courseImage: {
      type: String, // Cloudinary image URL
    
    },
    instructor: {
      name: { type: String },
      role: { type: String, default: "Teacher" },
      image: { type: String},
    },
    category: {
      type: String,
      enum: ["Primary", "Secondary"], // Either Primary or Secondary
      required: true,
    },
    subject: {
      type: String, // E.g., Physics, Chemistry, Mathematics
      required: true,
    },
    meta: {
      postedBy: { type: String, default: "Admin" },
      date: { type: Date, default: Date.now },
    },
    description: { type: String, required: true }, // Short course description
    highlights: [
      {
        heading: { type: String, required: true }, // Key course topics
        text: { type: String, required: true },
        example: { type: String },
      },
    ],
    readingTime: { type: Number }, // Estimated reading time in minutes
    
  },
  { timestamps: true }
);

const Course = mongoose.model("OfflineCourse", OfflineCourseSchema);
export default Course;

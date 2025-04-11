import mongoose from "mongoose";

const LiveCourseSchema = new mongoose.Schema(
  {
    title: { type: String },
    date: { type: String }, // Format: YYYY-MM-DD
    lessons: { type: String },
    totalCost: { type: String },
    studentsCount: { type: Number, default: 0 },
    lessonCount: { type: Number },
    time: { type: String },
    teacherId: { type: String }, // Reference to the teacher
    googleMeetLink: { type: String }, // New field for Google Meet link
  },
  { timestamps: true }
);

export default mongoose.model("LiveCourse", LiveCourseSchema);

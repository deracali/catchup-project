// import mongoose from "mongoose";

// const LessonSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   duration: { type: String, required: true },
//   url: { type: String, default: "" }, // Empty string as requested
//   previewImage: { type: String, default: "" } // Added preview image field
// });

// const CourseSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   instructor: {
//     name: { type: String, required: true },
//     about: { type: String, required: true },
//     role: { type: String, required: true },
//     image: { type: String, required: true }
//   },
//   price: {
//     original: { type: Number, required: true },
//     discounted: { type: Number, required: true }
//   },
//   rating: { type: Number, required: true },
//   reviews: { type: Number, required: true },
//   enrolledStudents: { type: String, default: "" }, // Empty string as requested
//   lessons: [LessonSchema],
//   courseIncludes: [{ type: String }],
//   skills: [{ type: String }],
//   students: { type: String, default: "" }, // Empty string as requested
//   description: { type: String },
//   tags: [{ type: String }],
//   date: { type: String },
//   language: { type: String }
// });


// const Course = mongoose.model("Course", CourseSchema);
// export default Course;

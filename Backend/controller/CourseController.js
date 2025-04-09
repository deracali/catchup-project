// import Course from "../model/CourseModel.js";
// import { v2 as cloudinary } from "cloudinary";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadVideo = async (filePath) => {
//   return await cloudinary.uploader.upload(filePath, {
//     resource_type: "video",
//     folder: "course_videos",
//   });
// };

// const uploadImage = async (filePath) => {
//   return await cloudinary.uploader.upload(filePath, {
//     folder: "course_images",
//   });
// };

// // ✅ Create a new course
// const createCourse = async (req, res) => {
//   try {
//     const { title, instructor, price, rating, reviews, lessons, description, tags, date, language, students, enrolledStudents, courseIncludes, skills } = req.body;
    
//     let videoUrl = "";
//     let previewImage = "";

//     if (req.files?.video) {
//       const videoUpload = await uploadVideo(req.files.video.tempFilePath);
//       videoUrl = videoUpload.secure_url;
//     }

//     if (req.files?.previewImage) {
//       const imageUpload = await uploadImage(req.files.previewImage.tempFilePath);
//       previewImage = imageUpload.secure_url;
//     }

//     const newCourse = new Course({
//       title,
//       instructor,
//       price,
//       rating,
//       reviews,
//       lessons,
//       description,
//       tags,
//       date,
//       language,
//       students,
//       enrolledStudents,
//       courseIncludes,
//       skills,
//       url: videoUrl,
//       previewImage,
//     });

//     await newCourse.save();
//     res.status(201).json({ message: "Course created successfully", course: newCourse });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Get all courses
// const getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.status(200).json(courses);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Get a single course by ID
// const getCourseById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const course = await Course.findById(id);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.status(200).json(course);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export { createCourse, getAllCourses, getCourseById };

import express from "express";
import fileUpload from "express-fileupload";
import { createCourse, deleteCourse, getAllCourses, getCoursesByCategory } from "../controller/OfflineCourseController.js";

const OfflineCourseRoute = express.Router();
OfflineCourseRoute.use(fileUpload({ useTempFiles: true })); // Middleware for file uploads

// Routes
OfflineCourseRoute.post("/create", createCourse); // Create course
OfflineCourseRoute.get("/", getAllCourses); // Get all courses
OfflineCourseRoute.get("/category/:category", getCoursesByCategory); // Get courses by category
OfflineCourseRoute.delete("/delete/:courseId", deleteCourse);
export default OfflineCourseRoute;

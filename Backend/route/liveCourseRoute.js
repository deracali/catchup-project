import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  joinCourse
} from "../controller/LiveCourse.js";

const courseRoutes = express.Router();

courseRoutes.get("/get", getCourses);
courseRoutes.get("/getbyid/:teacherId", getCourseById);
courseRoutes.post("/create", createCourse);
courseRoutes.put("/update/:id", updateCourse);
courseRoutes.delete("/delete/:id", deleteCourse);
courseRoutes.post("/:id/join", joinCourse); // Endpoint to join a course

export default courseRoutes;

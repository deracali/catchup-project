import express from "express";
import {
  registerTeacher,
  loginTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controller/TeachersController.js";

const TeacherRoute = express.Router();

TeacherRoute.post("/register", registerTeacher); // Register a teacher
TeacherRoute.post("/login", loginTeacher); // Login teacher
TeacherRoute.get("/", getAllTeachers); // Get all teachers
TeacherRoute.get("/:teacherId", getTeacherById); // Get a single teacher by ID
TeacherRoute.put("/:id", updateTeacher); // Update teacher details
TeacherRoute.delete("/delete/:id", deleteTeacher); // Delete a teacher

export default TeacherRoute;

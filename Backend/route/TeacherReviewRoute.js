import express from "express";
import fileUpload from "express-fileupload";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  updateTeacherStatus,
} from "../controller/TeacherReview.js";

const TeacherReviewRoute = express.Router();

// Use express-fileupload middleware
TeacherReviewRoute.use(fileUpload({ useTempFiles: true }));

TeacherReviewRoute.post("/create", createTeacher);
TeacherReviewRoute.patch("/status/:id", updateTeacherStatus);
TeacherReviewRoute.get("/", getAllTeachers);
TeacherReviewRoute.get("/get/:id", getTeacherById);
TeacherReviewRoute.put("/:id", updateTeacher);
TeacherReviewRoute.delete("/delete/:id", deleteTeacher);



export default TeacherReviewRoute;

import express from "express";
import {
  createQuizzes,
  getQuizzes,
  getQuizzesByCategory,
  getQuizzesBySubject,
  deleteQuiz,
  updateQuiz,
  getQuizById,
} from "../controller/QuizController.js";

const QuizRoute = express.Router();

// Create a new quiz question
QuizRoute.post("/", createQuizzes);

// Get all quizzes
QuizRoute.get("/", getQuizzes);


QuizRoute.put("/quizzes/:id", updateQuiz);



QuizRoute.get("/quiz/:id", getQuizById);


// Get quizzes by category (Primary or Secondary)
QuizRoute.get("/category/:category", getQuizzesByCategory);

// Get quizzes by subject
QuizRoute.get("/subject/:subject", getQuizzesBySubject);

// Delete a quiz question
QuizRoute.delete("delete/:id", deleteQuiz);

export default QuizRoute;

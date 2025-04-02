import express from "express";
import { addQuizScore, getUserScores, getQuizScore } from "../controller/QuizDataController.js";

const QuizDataRoute = express.Router();

QuizDataRoute.post("/", addQuizScore);
QuizDataRoute.get("/:userId", getUserScores);
QuizDataRoute.get("/:userId/:quizId", getQuizScore);

export default QuizDataRoute;

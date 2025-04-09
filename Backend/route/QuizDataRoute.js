import express from "express";
import { addQuizScore, getUserScores, getQuizScore, calculateUserTotalScore, getLeaderboard } from "../controller/QuizDataController.js";

const QuizDataRoute = express.Router();

QuizDataRoute.post("/", addQuizScore);
QuizDataRoute.get("/:userId", getUserScores);
QuizDataRoute.get("/:userId/:quizId", getQuizScore);
QuizDataRoute.get("/userTotalScore/:userId", calculateUserTotalScore);

// Route to get the leaderboard (top users by total score)
QuizDataRoute.get("/leaderboard", getLeaderboard);
export default QuizDataRoute;

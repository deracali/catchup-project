import express from "express";
import { addToLeaderBoard, getLeaderBoard, getQuizLeaderBoard } from "../controller/LeaderboardController.js";

const LeaderBoardRoute = express.Router();

LeaderBoardRoute.post("/", addToLeaderBoard);
LeaderBoardRoute.get("/", getLeaderBoard);
LeaderBoardRoute.get("/:quizId", getQuizLeaderBoard);

export default LeaderBoardRoute;

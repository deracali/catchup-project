import express from "express";
import { createReview, getReviews, likeReview, deleteReview } from "../controller/reviewController.js";

const reviewRoute = express.Router();

reviewRoute.post("/create", createReview);
reviewRoute.get("/get", getReviews);
reviewRoute.patch("/:id/like", likeReview);
reviewRoute.delete("/delete/:id", deleteReview);

export default reviewRoute;

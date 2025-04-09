import mongoose from "mongoose";

const quizScoreSchema = new mongoose.Schema(
  {
    userId: { type:String, required: true },
    quizId: { type: String, required: true },
    totalScore: { type: Number, required: true },
    dateTaken: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const QuizScore = mongoose.model("QuizScore", quizScoreSchema);
export default QuizScore;

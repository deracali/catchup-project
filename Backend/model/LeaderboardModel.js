import mongoose from "mongoose";

const leaderBoardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL of user image
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    dateTaken: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const LeaderBoard = mongoose.model("LeaderBoard", leaderBoardSchema);
export default LeaderBoard;

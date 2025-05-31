import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
    explanation: { type: String },
    subject: { type: String, required: true },
     type: { type: String },
    timeLimit: { type: Number, required: true },
  },
  { timestamps: true }
);

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    questions: [QuestionSchema],
    category: { type: String, enum: ["Primary", "Secondary"], required: true },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;

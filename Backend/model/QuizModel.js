import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
    subject: { type: String, required: true },
    timeLimit: { type: Number, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Title for the quiz
    questions: [QuestionSchema], // Array of questions
     category: { type: String, enum: ["Primary", "Secondary"], required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;

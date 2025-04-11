import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true }, // The actual question text
    options: { type: [String], required: true }, // Multiple choice options
    answer: { type: String, required: true }, // Correct answer (should match one of the options)
    explanation: { type: String }, // New field: explanation for the correct answer
    subject: { type: String, required: true }, // Subject area (e.g., Math, Science)
    timeLimit: { type: Number, required: true }, // Time limit in seconds to answer the question
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Title for the quiz
    questions: [QuestionSchema], // Array of questions with embedded schema
    category: { type: String, enum: ["Primary", "Secondary"], required: true }, // Educational level
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;

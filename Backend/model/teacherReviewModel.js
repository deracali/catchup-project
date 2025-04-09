import mongoose from "mongoose";

const TeacherReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Teacher", // Default role
    },
    designation: {
      type: String,
      required: true, // e.g., "Web Designer, Researcher"
    },
    profileImage: {
      type: String, // URL of profile picture
    
    },
    cv: {
      type: String, // URL of uploaded CV (PDF, DOCX, etc.)

    },
    rating: {
      type: Number,
      default: 0, // Rating out of 5
    },
    reviews: {
      type: Number,
      default: 0, // Number of reviews
    },
    about: {
      type: String, // About the teacher
      required: true,
    },
    address: {
      type: String,
      required: true, // Address information
    },
    acceptedOrRejected: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending", // Default status when a teacher registers
    },
    courses: {
      type: [String],
      default: [], // List of courses the teacher can teach
    },
  },
  { timestamps: true } // Auto adds createdAt and updatedAt
);

const TeacherReview = mongoose.model("TeacherReview", TeacherReviewSchema);
export default TeacherReview;

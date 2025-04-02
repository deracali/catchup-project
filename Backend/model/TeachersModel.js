import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
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
      required: true,
    },
    cv: {
      type: String, // URL to uploaded CV (PDF, DOCX, etc.)
      required: true,
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
       courses: {
          type: [String],
          default: [], // List of courses the teacher can teach
        },
  },
  { timestamps: true } // Auto adds createdAt and updatedAt
);

const Teacher = mongoose.model("Teacher", TeacherSchema);
export default Teacher;

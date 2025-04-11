import Teacher from "../model/TeachersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register a new teacher
export const registerTeacher = async (req, res) => {
  try {
      const { 
          name, 
          email, 
          password, 
          phone, 
          designation, 
          rating, 
          reviews, 
          about, 
          address, 
          acceptedOrRejected, 
          profileImage, 
          cv,
          courses // Added courses
      } = req.body;

      console.log("Request Body:", req.body); // Log the incoming request body

      // Check if the teacher already exists
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
          console.log("Teacher already exists with email:", email); // Log if teacher already exists
          return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("Password hashed successfully"); // Log when password is successfully hashed

      const teacher = new Teacher({
          name,
          email,
          password: hashedPassword,
          phone,
          designation,
          profileImage, // Accepting profileImage from body
          cv, // Accepting CV from body
          rating,
          reviews,
          about,
          address,
          acceptedOrRejected: acceptedOrRejected || "Pending", // Default to "Pending" if not provided
          courses: courses || [] // Added courses
      });

      console.log("Teacher object ready to be saved:", teacher); // Log the teacher object

      await teacher.save();
      console.log("Teacher saved successfully"); // Log when the teacher is successfully saved

      res.status(201).json({ message: "Teacher registered successfully", teacher });
  } catch (error) {
      console.error("Error in registering teacher:", error); // Log any error that occurs
      res.status(500).json({ error: error.message });
  }
};


// ✅ Login a teacher
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if teacher exists
    const teacher = await Teacher.findOne({ email: new RegExp("^" + email + "$", "i") });

    if (!teacher) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: teacher._id, role: teacher.role }, "secretKey", { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", token, teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { teacherId } = req.params;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Update teacher details
export const updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a teacher
export const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

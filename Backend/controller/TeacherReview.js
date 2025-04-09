import TeacherReview from "../model/teacherReviewModel.js";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  // Upload image to Cloudinary
  const uploadImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
      folder: "teacher_profiles",
    });
  };
  
  // Upload CV to Cloudinary
  const uploadCV = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
      folder: "teacher_CVs",
      resource_type: "raw", // Allows uploading PDFs, DOCX, etc.
    });
  };
  
  // ✅ Create a new teacher review
  export const createTeacher = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded Files:", req.files);

        const { 
            name, email, password, phone, designation, rating, reviews, about, address, acceptedOrRejected, courses 
        } = req.body;

        let profileImage = "";
        let cv = "";

        // Upload profile image if provided
        if (req.files?.profileImage) {
            const imageUpload = await uploadImage(req.files.profileImage.tempFilePath);
            profileImage = imageUpload.secure_url;
        }

        // Upload CV if provided
        if (req.files?.cv) {
            const cvUpload = await uploadCV(req.files.cv.tempFilePath);
            cv = cvUpload.secure_url;
        }

        // Fix: Ensure courses is an array
        let coursesArray = Array.isArray(courses) 
            ? courses // If it's already an array, use it
            : courses?.split(",").map(course => course.trim()) || []; // Otherwise, split it into an array

        const newTeacher = new TeacherReview({
            name,
            email,
            password,
            phone,
            designation,
            profileImage,
            cv,
            rating,
            reviews,
            about,
            address,
            acceptedOrRejected: acceptedOrRejected || "Pending",
            courses: coursesArray // Store as an array
        });

        await newTeacher.save();
        res.status(201).json({ message: "Teacher review created successfully", teacher: newTeacher });
    } catch (error) {
        console.error("Error in createTeacher:", error);
        res.status(500).json({ error: error.message });
    }
};

  
  
// ✅ Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await TeacherReview.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await TeacherReview.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update teacher review
export const updateTeacher = async (req, res) => {
  try {
    const { name, email, password, phone, designation, rating, reviews, about, address } = req.body;
    
    let updateData = { name, email, password, phone, designation, rating, reviews, about, address };

    if (req.files?.profileImage) {
      const imageUpload = await uploadImage(req.files.profileImage.tempFilePath);
      updateData.profileImage = imageUpload.secure_url;
    }

    const updatedTeacher = await TeacherReview.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedTeacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete teacher review
export const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await TeacherReview.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



import { v2 as cloudinary } from "cloudinary";
import Course from "../model/OfflineCourse.js";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "teacher_profiles",
  });
};



// ✅ Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, instructorName, instructorRole, category, subject, description, highlights } = req.body;
    
    let courseImage = "";
    let instructorImage = "";

    if (req.files?.courseImage) {
      const imageUpload = await uploadImage(req.files.courseImage.tempFilePath);
      courseImage = imageUpload.secure_url;
    }

    if (req.files?.instructorImage) {
      const instructorImageUpload = await uploadImage(req.files.instructorImage.tempFilePath);
      instructorImage = instructorImageUpload.secure_url;
    }

    // Calculate reading time (assuming average reading speed is 200 words per minute)
    const wordCount = description.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const newCourse = new Course({
      title,
      courseImage,
      instructor: {
        name: instructorName,
        role: instructorRole || "Teacher",
        image: instructorImage,
      },
      category,
      subject,
      description,
      highlights: JSON.parse(highlights), // Array of topics
      readingTime, // Added reading time
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get courses by category (Primary or Secondary)
export const getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await Course.find({ category }).sort({ createdAt: -1 });

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found in this category" });
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete images from Cloudinary
    if (course.courseImage) {
      const publicId = course.courseImage.split('/').pop().split('.')[0]; // Extract public_id
      await cloudinary.uploader.destroy(`course_images/${publicId}`);
    }
    
    if (course.instructor.image) {
      const instructorPublicId = course.instructor.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`course_images/${instructorPublicId}`);
    }

    // Remove course from database
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

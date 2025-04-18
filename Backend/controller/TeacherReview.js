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
  

  // mailer.js or equivalent
const sendTeacherRegistrationEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px;">
      <h2 style="color: #00a859;">Welcome to CatchUpED, ${name}!</h2>
      <p>Thank you for registering as a teacher. Your profile is under review and we’ll get back to you once it's approved.</p>
      <p>We’re thrilled to have passionate educators like you on board!</p>
      <br/>
      <p>– CatchUpED Team</p>
    </div>
  `;

  const mailOptions = {
    from: 'info@catchuped.com',
    to: email,
    subject: 'Teacher Registration Received – CatchUpED',
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Teacher registration email sent to ${email}`);
  } catch (error) {
    console.error('❌ Teacher email error:', error);
  }
};



  // ✅ Create a new teacher review
  export const createTeacher = async (req, res) => {
    try {
      console.log("Request Body:", req.body);
      console.log("Uploaded Files:", req.files);
  
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
        courses,
        profileImage,
        cv,
      } = req.body;
  
      let uploadedProfileImage = "";
      let uploadedCV = "";
  
      if (req.files?.profileImage) {
        const imageUpload = await uploadImage(req.files.profileImage.tempFilePath);
        uploadedProfileImage = imageUpload.secure_url;
      } else if (profileImage) {
        const imageUpload = await uploadImage(profileImage);
        uploadedProfileImage = imageUpload.secure_url;
      }
  
      if (req.files?.cv) {
        const cvUpload = await uploadCV(req.files.cv.tempFilePath);
        uploadedCV = cvUpload.secure_url;
      } else if (cv) {
        const cvUpload = await uploadCV(cv);
        uploadedCV = cvUpload.secure_url;
      }
  
      let coursesArray = Array.isArray(courses)
        ? courses
        : courses?.split(",").map(course => course.trim()) || [];
  
      const newTeacher = new TeacherReview({
        name,
        email,
        password,
        phone,
        designation,
        profileImage: uploadedProfileImage,
        cv: uploadedCV,
        rating,
        reviews,
        about,
        address,
        acceptedOrRejected: acceptedOrRejected || "Pending",
        courses: coursesArray,
      });
  
      await newTeacher.save();
  
      // ✅ Send registration confirmation email
      await sendTeacherRegistrationEmail(email, name);
  
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



// ✅ Update only the acceptedOrRejected status
export const updateTeacherStatus = async (req, res) => {
  try {
    const { status } = req.body; // expected value: "Accepted" or "Rejected"
    
    // Validate input
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'Accepted' or 'Rejected'." });
    }

    const teacher = await TeacherReview.findByIdAndUpdate(
      req.params.id,
      { acceptedOrRejected: status },
      { new: true }
    );

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json({
      message: `Teacher has been ${status.toLowerCase()}`,
      teacher,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


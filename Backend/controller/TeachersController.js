import Teacher from "../model/TeachersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// mailer.js or equivalent
const sendTeacherAcceptedEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px;">
      <h2 style="color: #00a859;">Congratulations ${name} – You’re In!</h2>
      <p>Your teacher profile has been reviewed and <strong>accepted</strong> by the CatchUpED team.</p>
      <p>You can now log in to your dashboard and begin sharing your expertise with eager students.</p>
      <p>We’re excited to see the impact you’ll make 🚀</p>
      <br/>
      <a href="https://catchuped.com/teacher-dashboard" style="display:inline-block; background-color:#00a859; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Go to Dashboard</a>
      <br/><br/>
      <p>– The CatchUpED Team</p>
    </div>
  `;

  const mailOptions = {
    from: 'info@catchuped.com',
    to: email,
    subject: 'Your Teacher Profile Has Been Approved – CatchUpED',
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Teacher accepted email sent to ${email}`);
  } catch (error) {
    console.error('❌ Teacher accepted email error:', error);
  }
};

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
      courses
    } = req.body;

    console.log("Request Body:", req.body);

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      console.log("Teacher already exists with email:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed successfully");

    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      phone,
      designation,
      profileImage,
      cv,
      rating,
      reviews,
      about,
      address,
      acceptedOrRejected: acceptedOrRejected || "Pending",
      courses: courses || []
    });

    console.log("Teacher object ready to be saved:", teacher);

    await teacher.save();
    console.log("Teacher saved successfully");

    // ✅ Send welcome email
    await sendTeacherAcceptedEmail(email, name);

    res.status(201).json({ message: "Teacher registered successfully", teacher });
  } catch (error) {
    console.error("Error in registering teacher:", error);
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

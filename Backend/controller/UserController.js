import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
dotenv.config();


const JWT_SECRET = "VFSLJVKDVJKSMDKMAKMD";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });
};


const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 587,  // Use 465 for SSL if needed
  secure: false, // Set to `true` if using port 465
  auth: {
      user: 'info@catchuped.com',  // Your Titan Mail email
      pass: 'Studenthouse2020@' // Your Titan Mail password
  }
});  


const sendEmail = async (to, subject, name) => {
  const mailOptions = {
    from: 'info@catchuped.com',
    to,
    subject,
    html: `
      <div style="background-color: #f5f7fa; padding: 40px; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #eaf1fb; text-align: center; padding: 30px 0;">
              <h2 style="color: #2c5eff; margin: 0;">CatchUpED</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h1 style="font-size: 24px; color: #333;">Welcome, ${name}!</h1>
              <p style="font-size: 16px; color: #555;">Thanks for choosing <strong>CatchUpED</strong>! We are happy to see you on board.</p>
              <p style="font-size: 16px; color: #555;">To get started, do this next step:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://catchuped.com/login" style="background-color: #2c5eff; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; display: inline-block;">Next Step</a>
              </div>
              <p style="font-size: 14px; color: #888;">If you didn’t sign up for this, you can ignore this email.</p>
            </td>
          </tr>
        </table>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email error:', error);
    if (error.response) {
      console.error('SMTP response:', error.response);
    }
  }
};


const sendLoginEmail = async (to, name) => {
  const mailOptions = {
    from: 'info@catchuped.com',
    to,
    subject: 'Login Notification - CatchUpED',
    html: `
      <div style="background-color: #f5f7fa; padding: 40px; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #eaf1fb; text-align: center; padding: 30px 0;">
              <h2 style="color: #2c5eff; margin: 0;">CatchUpED</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h1 style="font-size: 22px; color: #333;">Hi ${name},</h1>
              <p style="font-size: 16px; color: #555;">
                A login to your <strong>CatchUpED</strong> account was just detected. If this was you, you can ignore this message.
              </p>
              <p style="font-size: 16px; color: #555;">
                If this wasn't you, please reset your password immediately and contact support.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://catchuped.com/reset-password" style="background-color: #ff4f4f; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; display: inline-block;">Reset Password</a>
              </div>
              <p style="font-size: 14px; color: #888;">Need help? Reach out at support@catchuped.com</p>
            </td>
          </tr>
        </table>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Login email sent to ${to}`);
  } catch (error) {
    console.error('Login Email Error:', error);
  }
};


// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("🔹 Hashed Password Before Saving:", hashedPassword);

    user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    await user.save();

    // ✅ Send welcome email
    await sendEmail(normalizedEmail, 'Welcome to CatchUpED!', name);

    const token = generateToken(user);
    res.status(201).json({ user, token, role });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log("❌ User not found for email:", normalizedEmail);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔹 Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Send login email
    await sendLoginEmail(user.email, user.name);

    const token = generateToken(user);
    console.log(user.role);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const { name, about, image, email, role } = req.body;

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (about) user.about = about;
    if (image) user.image = image;
    if (role) user.role = role;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// Get user profile
const getProfile = async (req, res) => {
    try {
      const { id } = req.params; // Extract ID from URL params
      const user = await User.findById(id).select("-password");
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


const getUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password");


    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update the time spent by the user and adjust their level
const updateTimeSpent = async (req, res) => {
  const { userId, timeSpent } = req.body; // timeSpent is expected in seconds

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment the user's total time spent
    user.totalTimeSpent += timeSpent;

    // Calculate and update the user's level based on time spent
    const newLevel = calculateUserLevel(user.totalTimeSpent);
    user.level = newLevel;

    // Save the updated user data to the database
    await user.save();

    // Respond with the updated user data
    return res.status(200).json({
      message: 'Time spent updated successfully',
      user: {
        level: user.level,
        totalTimeSpent: user.totalTimeSpent,
      },
    });
  } catch (error) {
    console.error('Error updating time spent:', error);
    return res.status(500).json({ message: 'An error occurred while updating time spent', error });
  }
};

// Helper function to calculate user level based on total time spent
const calculateUserLevel = (timeSpent) => {
  if (timeSpent >= 10000) return 5;  // Advanced level (e.g., 10,000 seconds)
  if (timeSpent >= 7500) return 4;   // Level 4
  if (timeSpent >= 5000) return 3;   // Level 3
  if (timeSpent >= 2500) return 2;   // Level 2
  return 1;  // Level 1 (starting level)
};

// Get the current user's data including level and time spent
const getUserData = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's level and total time spent
    return res.status(200).json({
      user: {
        level: user.level,
        totalTimeSpent: user.totalTimeSpent,
      },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'An error occurred while fetching user data', error });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userid);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: error.message });
  }
};





// Create or update a user's subscription
const createSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { plan, startDate, endDate } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: Remove existing subscription with same plan if needed
    const existingIndex = user.subscriptions.findIndex(
      (sub) => sub.plan === plan
    );
    if (existingIndex !== -1) {
      user.subscriptions.splice(existingIndex, 1);
    }

    // Add new subscription
    user.subscriptions.push({ plan, startDate, endDate });
    await user.save();

    // Check if user now has a valid "Per Subject" subscription
    const now = new Date();
    const hasPerSubject = user.subscriptions.some(
      (sub) => sub.plan === "Per Subject" && new Date(sub.endDate) > now
    );

    res.status(200).json({
      message: "Subscription updated successfully",
      subscriptions: user.subscriptions,
      hasPerSubject,
    });
  } catch (error) {
    console.error("Subscription Error:", error);
    res.status(500).json({ message: "Failed to update subscription", error: error.message });
  }
};



export { signup, login, getProfile, getUsers, updateTimeSpent,createSubscription, getUserData, updateUser, deleteUser };

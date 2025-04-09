import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();


const JWT_SECRET = "VFSLJVKDVJKSMDKMAKMD";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });
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

    // **Hash the password correctly**
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("🔹 Hashed Password Before Saving:", hashedPassword);

    user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword, // Save hashed password
      role, // Assign role
    });

    await user.save();

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

    const token = generateToken(user);

    // Ensure role is included in the response
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Include the role in the response
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
    const { name, about, image, role } = req.body;

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided
    if (name) user.name = name;
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




export { signup, login, getProfile, getUsers, updateTimeSpent, getUserData, updateUser, deleteUser };

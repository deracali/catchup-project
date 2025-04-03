import Admin from "../model/AdminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: "Admin already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save to database
    const savedAdmin = await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedAdmin._id, role: savedAdmin.role },
      process.env.JWT_SECRET || "vdsvdsvdvdvdssec",
      { expiresIn: "7d" }
    );

    // Send response with token, role, and _id
    res.status(201).json({
      message: "Admin registered successfully",
      token,
      _id: savedAdmin._id,
      role: savedAdmin.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Admin
export const updateAdmin = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.role = role || admin.role;

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();
    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await admin.deleteOne();
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controller/AdminController.js";

const AdminRoute = express.Router();

AdminRoute.post("/register", registerAdmin);
AdminRoute.post("/login", loginAdmin);
AdminRoute.get("/", getAllAdmins);
AdminRoute.get("/:id", getAdminById);
AdminRoute.put("/:id", updateAdmin);
AdminRoute.delete("/:id", deleteAdmin);

export default AdminRoute;
